// lib/auth.ts
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        try {
          console.log("🪪 Credenciales recibidas:", credentials);

          const siwe = new SiweMessage(credentials?.message || "");

          console.log("📩 Mensaje SIWE parseado:", siwe);

          const domain = new URL(process.env.NEXTAUTH_URL!).host;
          console.log("🌐 Dominio usado:", domain);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain,
            nonce: siwe.nonce,
          });

          console.log("✅ Resultado de siwe.verify():", result);

          if (result.success) {
            return { id: siwe.address };
          }

          return null;
        } catch (err) {
          console.error("❌ Error en authorize():", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
