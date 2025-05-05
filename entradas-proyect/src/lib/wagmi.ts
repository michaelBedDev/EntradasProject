import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { publicActions } from "viem";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Entradas Proyect",
  projectId: "dcd16fea20fd0c39832b6e0d31bc0aa2",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});

export const publicClient = config.getClient().extend(publicActions);
