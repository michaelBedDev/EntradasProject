"use client";

import type React from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { config } from "@/lib/wagmi";
// import type { Session } from "next-auth";
import { RainbowKitSiweNextAuthProviderWithSession } from "@/lib/pr2335/RainbowKitSiweNextAuthProviderWithSession";
import { base } from "viem/chains";

// import { SessionProvider } from "next-auth/react";

// const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitSiweNextAuthProviderWithSession>
        <RainbowKitProvider initialChain={base}>{children}</RainbowKitProvider>
      </RainbowKitSiweNextAuthProviderWithSession>
    </WagmiProvider>
  );
}
