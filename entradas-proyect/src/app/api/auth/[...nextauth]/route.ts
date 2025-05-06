import { NextAuthHandler } from "@/lib/NextAuthHandler";
import { mainnet } from "viem/chains";
import { createSupabaseJwt } from "@/lib/supabase/jwt";

// The handler creates both GET and POST endpoints required by NextAuth.js
const { GET, POST } = NextAuthHandler({
  chain: mainnet, // The chain to use for SIWE message verification
  authOptions: {
    callbacks: {
      async session({ session, token }) {
        if (token.sub) {
          session.address = token.sub;
          session.supabaseToken = createSupabaseJwt(token.sub);
        }
        return session;
      },
    },
  },
});
export { GET, POST };
