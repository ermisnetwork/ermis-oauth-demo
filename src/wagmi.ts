import { http, createConfig } from "wagmi";
import { mainnet, sepolia, arbitrum } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Belo Login" }),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum] as const;
export const configWalletConnect = defaultWagmiConfig({
  chains,
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  metadata,
  // ...wagmiOptions, // Optional - Override createConfig parameters
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
