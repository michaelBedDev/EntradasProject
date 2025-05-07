import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Chain } from "viem";
import { siweAuthOptions } from "@/lib/authOptions";

interface NextAuthHandlerProps {
  chain: Chain;
  authOptions?: Partial<NextAuthOptions>;
}

/** Combina authOptions externos sin perder callbacks de siweAuthOptions */
export const NextAuthHandler = ({
  chain,
  authOptions = {},
}: NextAuthHandlerProps) => {
  const base = siweAuthOptions({ chain, ...authOptions });

  const merged: NextAuthOptions = {
    ...base,
    ...authOptions,
    callbacks: {
      ...base.callbacks,
      ...authOptions.callbacks,
    },
  };

  const handler = NextAuth(merged);
  return { GET: handler, POST: handler };
};
