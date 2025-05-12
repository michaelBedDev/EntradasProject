// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import {
  type SIWESession,
  /* verifySignature, */
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";
import { createPublicClient, http } from "viem";
import { createSupabaseJwt } from "@/lib/supabase/utils";

declare module "next-auth" {
  interface Session extends SIWESession {
    address: string;
    chainId: number;
    // añadimos aquí el JWT de Supabase
    supabase: {
      token: string;
      exp: number;
    };
  }
}

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
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

const handler = NextAuth({
  // https://next-auth.js.org/configuration/providers/oauth
  secret: nextAuthSecret,
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // generamos aquí el JWT de Supabase la primera vez
    // Esto solo se ejecuta la primera vez que el usuario inicia sesión
    async jwt({ token, user }) {
      if (user) {
        // token.sub === user.id === "chainId:address"
        const [, , address] = (token.sub as string).split(":");
        token.supabase = createSupabaseJwt(address); // Aquí se firma el JWT de supabase y se guarda en la sesión (token next-auth)
      }
      return token;
    },
    // Esto se ejecuta cada vez que se accede a la sesión
    session({ session, token }) {
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
      }

      // refrescar mantener token??

      return session;
    },
  },
});

export { handler as GET, handler as POST };
