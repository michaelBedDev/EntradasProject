import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type Chain, createPublicClient, http } from "viem";
import { parseSiweMessage } from "viem/siwe";

import { createSupabaseJwt } from "@/lib/supabase/utils";

/* ------------------ helpers ------------------ */
// services/auth.ts
import { supabaseAdmin } from "@/lib/supabase/adminClient";
import { getEnsName } from "viem/actions";
import { mainnet } from "viem/chains";
import { walletToUid } from "@/lib/supabase/utils";

// Tipo base con ENS opcional
export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    wallet: string;
    display_name?: string;
  };
}

// Usuario con ENS resuelto
export interface UserWithENS extends SupabaseUser {
  user_metadata: {
    wallet: string;
    display_name: string;
  };
}

// Usuario sin ENS
export interface UserWithoutENS extends SupabaseUser {
  user_metadata: {
    wallet: string;
    // display_name ni existe ni siquiera como undefined
  };
}

export async function ensureUserWithWallet(
  address: string,
  ensName?: string | null,
): Promise<UserWithENS | UserWithoutENS> {
  const wallet = address.toLowerCase();
  const uid = walletToUid(address);
  const email = `${wallet}@wallet.local`;

  // 1️⃣ Resolver ENS si no viene
  let display_name: string | undefined = ensName ?? undefined;
  if (!display_name) {
    try {
      const client = createPublicClient({ chain: mainnet, transport: http() });
      display_name =
        (await getEnsName(client, { address: wallet as `0x${string}` })) ??
        undefined;
    } catch {
      /* ignoramos fallo */
    }
  }

  // Asegurarnos de que display_name nunca quede vacío
  display_name = display_name ?? wallet;

  // 2️⃣ Comprobar en Supabase
  const { data: getData, error: getError } =
    await supabaseAdmin.auth.admin.getUserById(uid);
  if (getError && getError.status !== 404) throw getError;
  const existing = getData?.user;

  // 3️⃣ Crear o actualizar y devolver tipado correctamente
  const metadata = { wallet, display_name };

  if (!existing) {
    const { data: createData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        id: uid,
        email,
        user_metadata: metadata,
      });
    if (createError) throw createError;
    const u = createData.user!;

    if (ensName || display_name !== wallet) {
      return {
        id: u.id,
        email: u.email!,
        user_metadata: { wallet, display_name },
      } as UserWithENS;
    } else {
      return {
        id: u.id,
        email: u.email!,
        user_metadata: { wallet, display_name },
      } as UserWithoutENS;
    }
  } else {
    const { data: updData, error: updError } =
      await supabaseAdmin.auth.admin.updateUserById(uid, {
        user_metadata: metadata,
      });
    if (updError) throw updError;
    const u = updData.user!;

    if (ensName || display_name !== wallet) {
      return {
        id: u.id,
        email: u.email!,
        user_metadata: { wallet, display_name },
      } as UserWithENS;
    } else {
      return {
        id: u.id,
        email: u.email!,
        user_metadata: { wallet, display_name },
      } as UserWithoutENS;
    }
  }
}

/* -------------- configuración Next-Auth -------------- */

export interface SiweAuthConfig {
  chain: Chain;
}

export const siweAuthOptions = ({ chain }: SiweAuthConfig): NextAuthOptions => {
  const publicClient = createPublicClient({ chain, transport: http() });

  return {
    providers: [
      CredentialsProvider({
        id: "credentials",
        name: "Ethereum",
        credentials: {
          message: { label: "Message", type: "text" },
          signature: { label: "Signature", type: "text" },
        },
        async authorize(credentials) {
          if (!credentials?.message || !credentials?.signature) return null;

          const parsed = parseSiweMessage(credentials.message);

          const valid = await publicClient.verifySiweMessage({
            message: credentials.message,
            signature: credentials.signature as `0x${string}`,
            domain: parsed.domain,
            nonce: parsed.nonce,
          });

          if (!valid || !parsed.address) return null;

          /* asegura user + metadata */
          await ensureUserWithWallet(parsed.address);

          return { id: parsed.address, address: parsed.address };
        },
      }),
    ],

    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
      async jwt({ token, user }) {
        if (user) token.address = user.address;
        return token;
      },

      async session({ session, token }) {
        if (token.address) {
          session.address = token.address;
          session.supabaseToken = createSupabaseJwt(token.address);
        }
        return session;
      },
    },
  };
};
