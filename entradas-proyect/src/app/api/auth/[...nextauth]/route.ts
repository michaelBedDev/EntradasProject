import { NextAuthHandler } from "@/lib/NextAuthHandler";
import { mainnet } from "viem/chains";
import { createSupabaseJwt, SUPABASE_JWT_TTL_SECONDS } from "@/lib/supabase/utils";

const { GET, POST } = NextAuthHandler({
  chain: mainnet,
  authOptions: {
    callbacks: {
      async jwt({ token, user }) {
        if (user?.address) token.address = user.address;
        return token;
      },

      async session({ session, token }) {
        if (token.address) {
          const supabaseToken = createSupabaseJwt(token.address);
          session.address = token.address;
          session.supabaseToken = supabaseToken;
          session.supabaseTokenExp =
            Math.floor(Date.now() / 1000) + SUPABASE_JWT_TTL_SECONDS;
        }
        return session;
      },
    },
  },
});

export { GET, POST };
