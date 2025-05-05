"use client";

import type React from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { config } from "@/lib/wagmi";
// import type { Session } from "next-auth";
import { RainbowKitSiweNextAuthProviderWithSession } from "@/providers/rainbowkit/RainbowKitSiweNextAuthProviderWithSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function RainbowkitProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitSiweNextAuthProviderWithSession>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </RainbowKitSiweNextAuthProviderWithSession>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
