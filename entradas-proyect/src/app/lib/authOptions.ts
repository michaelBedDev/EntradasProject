import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAddressFromMessage, getChainIdFromMessage } from "@reown/appkit-siwe";
import { createPublicClient, http } from "viem";
import { createSupabaseJwt } from "@/lib/supabase/utils";
import jwt from "jsonwebtoken";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.message) throw new Error("Missing SIWE message");

        try {
          const { message, signature } = credentials;
          const address = getAddressFromMessage(message);
          const chainId = getChainIdFromMessage(message);

          const publicClient = createPublicClient({
            transport: http(
              `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${process.env.NEXT_PUBLIC_PROJECT_ID}`,
            ),
          });

          const isValid = await publicClient.verifyMessage({
            message,
            address: address as `0x${string}`,
            signature: signature as `0x${string}`,
          });

          return isValid ? { id: `${chainId}:${address}` } : null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user?.id) {
        // Corregir split del user.id
        const [, chainId, address] = user.id.split(":"); // [0] = chainId, [1] = address

        // Obtener token y exp de forma correcta
        const { token: supabaseToken, exp } = createSupabaseJwt(address);

        return {
          ...token,
          supabaseAccessToken: supabaseToken,
          supabaseAccessTokenExp: exp,
          wallet: address, // Almacenar solo el address sin chainId
        };
      }

      // authOptions.ts (última corrección)
      if (trigger === "update") {
        // Asegurar que wallet es string usando operador de aserción
        const walletAddress = (token.wallet || "") as string;
        const { token: newToken, exp } = createSupabaseJwt(walletAddress);

        return {
          ...token,
          supabaseAccessToken: newToken,
          supabaseAccessTokenExp: exp,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        supabaseAccessToken: token.supabaseAccessToken as string,
        supabaseAccessTokenExp: token.supabaseAccessTokenExp as number,
        address: token.wallet || "", // Acceso directo sin split
      };
    },
  },
};
