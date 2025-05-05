import { NextAuthHandler } from "@/lib/NextAuthHandler";
import { mainnet } from "viem/chains";

// The handler creates both GET and POST endpoints required by NextAuth.js
const { GET, POST } = NextAuthHandler({
  chain: mainnet, // The chain to use for SIWE message verification
  authOptions: {
    // Optional: Additional NextAuth.js configuration
    // ...
  },
});
export { GET, POST };
