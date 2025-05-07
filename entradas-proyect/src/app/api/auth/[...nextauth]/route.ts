// app/api/auth/[...nextauth]/route.ts
import { NextAuthHandler } from "@/lib/NextAuthHandler";
import { mainnet } from "viem/chains";
import { createSupabaseJwt } from "@/lib/supabase/jwt";

const { GET, POST } = NextAuthHandler({
  chain: mainnet,
  authOptions: {
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.address = user.address;
        }
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
  },
});

export { GET, POST };
