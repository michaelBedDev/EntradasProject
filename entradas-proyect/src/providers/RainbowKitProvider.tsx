"use client";

import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { config } from "@/lib/wagmi";
import type { Session } from "next-auth";

import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export function Providers({
  children,
  session, // <-- Recibe la sesión como prop
}: {
  children: React.ReactNode;
  session: Session | null; // <-- Añade el tipo de la sesión
}) {
  return (
    <WagmiProvider config={config}>
      <SessionProvider refetchInterval={0} session={session}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitSiweNextAuthProvider>
            <RainbowKitProvider>{children}</RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}
