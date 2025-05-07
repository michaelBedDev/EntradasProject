import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type Chain, createPublicClient, http } from "viem";
import { parseSiweMessage } from "viem/siwe";

import { createClient } from "@supabase/supabase-js";
import { createSupabaseJwt, walletToUid } from "@/lib/supabase/jwt";

/* ------------------ helpers ------------------ */

async function ensureUserWithWallet(address: string) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const uid = walletToUid(address);
  const wallet = address.toLowerCase();

  /* 1️⃣  crea el usuario: los atributos van en la raíz, no en .user  */
  await admin.auth.admin
    .createUser({
      id: uid,
      email: `${uid}@wallet.local`, // dummy requerido por GoTrue
      user_metadata: { wallet }, // ya lo insertamos aquí
    })
    .catch(() => {
      /* duplicate key → el usuario ya existe: lo ignoramos */
    });

  /* 2️⃣  por si existe y queremos mantener la wallet actualizada */
  await admin.auth.admin.updateUserById(uid, {
    user_metadata: { wallet },
  });
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
