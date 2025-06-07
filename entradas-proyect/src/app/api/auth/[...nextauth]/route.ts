// src/app/api/auth/[...nextauth]/route.ts
import credentialsProvider from "next-auth/providers/credentials";
import {
  /* verifySignature, */
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";
import { createPublicClient, http } from "viem";
import { createSupabaseJwt, isTokenExpiredOrExpiring } from "@/lib/supabase/utils";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { getUserRoleFromAPI } from "@/features/auth/services/getUserRoleFromAPI";

const nextAuthSecret = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

const providers = [
  credentialsProvider({
    name: "Ethereum",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.message) {
          throw new Error("SiweMessage is undefined");
        }
        const { message, signature } = credentials;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        // for the moment, the verifySignature is not working with social logins and emails  with non deployed smart accounts
        /*  const isValid = await verifySignature({
             address,
             message,
             signature,
             chainId,
             projectId,
           }); */
        // we are going to use https://viem.sh/docs/actions/public/verifyMessage.html
        const publicClient = createPublicClient({
          transport: http(
            `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`,
          ),
        });
        const isValid = await publicClient.verifyMessage({
          message,
          address: address as `0x${string}`,
          signature: signature as `0x${string}`,
        });
        // end o view verifyMessage

        if (isValid) {
          return {
            id: `${chainId}:${address}`,
          };
        }

        return null;
      } catch (e) {
        console.error("Error during SIWE authorization:", e);
        return null;
      }
    },
  }),
];

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string } }) {
      if (user && token.sub) {
        // token.sub === user.id === "chainId:address"
        const [, address] = token.sub.split(":");

        // Si no existe el JWT de supabase, lo creamos (primera vez)
        token.supabase = createSupabaseJwt(address);
      }

      // Regenerar el token si está a menos de 1 minuto de expirar
      if (isTokenExpiredOrExpiring(token.supabase?.exp)) {
        const [, , address] = token.sub?.split(":") ?? [];

        token.supabase = createSupabaseJwt(address);
      }

      // Hacemos una llamada para obtener el rol del usuario
      const userRole = await getUserRoleFromAPI(token.sub);
      token.userRole = userRole;

      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (!token.sub) {
        return session;
      }
      // extraemos chainId y address de token.sub
      const [, chainId, address] = token.sub.split(":");
      if (chainId && address) {
        session.address = address;
        session.chainId = parseInt(chainId, 10);

        // añadimos el JWT de Supabase a la sesión expuesta al cliente. tiene tipo JWT.supabase
        if (token.supabase) {
          session.supabase = token.supabase;
        }

        // añadimos el rol del usuario a la sesión expuesta al cliente
        if (token.userRole) {
          session.userRole = token.userRole;
        }
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
