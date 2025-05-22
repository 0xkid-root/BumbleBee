import { createPublicClient } from "viem";
import { createWalletClient } from "viem";
import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export function getConfig() {
  return createConfig({
    chains: [sepolia],
    connectors: [metaMask()],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [sepolia.id]: http(),
    },
  });
}