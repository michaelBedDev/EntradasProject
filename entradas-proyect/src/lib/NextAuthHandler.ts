import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Chain } from "viem";
import { siweAuthOptions } from "@/lib/authOptions";

interface NextAuthHandlerProps {
  chain: Chain;
  authOptions?: Partial<NextAuthOptions>;
}

export const NextAuthHandler = ({
  chain,
  authOptions = {},
}: NextAuthHandlerProps) => {
  const handler = NextAuth(
    siweAuthOptions({
      chain,
      ...authOptions,
    }),
  );

  return {
    GET: handler,
    POST: handler,
  };
};
