// // lib/auth.ts
// import { type NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { SiweMessage } from "siwe";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Ethereum",
//       credentials: {
//         message: { label: "Message", type: "text" },
//         signature: { label: "Signature", type: "text" },
//       },
//       async authorize(credentials) {
//         try {
//           console.log("🪪 Credenciales recibidas:", credentials);

//           const siwe = new SiweMessage(credentials?.message || "");

//           console.log("📩 Mensaje SIWE parseado:", siwe);

//           const domain = new URL(process.env.NEXTAUTH_URL!).host;
//           console.log("🌐 Dominio usado:", domain);

//           const result = await siwe.verify({
//             signature: credentials?.signature || "",
//             domain,
//             nonce: siwe.nonce,
//           });

//           console.log("✅ Resultado de siwe.verify():", result);

//           if (result.success) {
//             return { id: siwe.address };
//           }

//           return null;
//         } catch (err) {
//           console.error("❌ Error en authorize():", err);
//           return null;
//         }
//       },
//     }),
//   ],
//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,
// };

import CredentialsProvider from "next-auth/providers/credentials";
import { parseSiweMessage, validateSiweMessage, type SiweMessage } from "viem/siwe";
import { publicClient } from "@/lib/wagmiServer"; // ajusta esta ruta
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials: any, req: any) {
        try {
          const siweMessage = parseSiweMessage(credentials?.message) as SiweMessage;

          if (
            !validateSiweMessage({
              address: siweMessage?.address,
              message: siweMessage,
            })
          )
            return null;

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
          if (!nextAuthUrl) return null;

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siweMessage.domain !== nextAuthHost) return null;

          const csrfToken = req?.body?.csrfToken || req?.headers.get("csrf-token");
          if (siweMessage.nonce !== csrfToken) return null;

          const valid = await publicClient.verifyMessage({
            address: siweMessage?.address,
            message: credentials?.message,
            signature: credentials?.signature,
          });

          if (!valid) return null;

          return { id: siweMessage.address };
        } catch (e) {
          console.error("Error authorizing user", e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.address = token.sub;
      session.user = { name: token.sub };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
