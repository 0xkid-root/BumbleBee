import type {
  Implementation,
  MetaMaskSmartAccount,
} from "@metamask/delegation-toolkit";
import { lineaSepolia as chain } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import {
  createBundlerClient,
  createPaymasterClient,
} from "viem/account-abstraction";
import { http } from "viem";

// Default bundler URL if environment variable is not set
const BUNDLER_URL = "https://api.pimlico.io/v2/11155111/rpc?apikey=pim_dLoZZrLYBZNJ91bN3zGTtw";

// Create clients only if we're in a browser environment to avoid SSR issues
let paymasterClient: ReturnType<typeof createPaymasterClient>;
let bundler: ReturnType<typeof createBundlerClient>;
let pimlicoClient: ReturnType<typeof createPimlicoClient>;

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  paymasterClient = createPaymasterClient({
    transport: http(BUNDLER_URL),
  });

  bundler = createBundlerClient({
    transport: http(BUNDLER_URL),
    paymaster: paymasterClient,
    chain,
  });

  pimlicoClient = createPimlicoClient({
    transport: http(BUNDLER_URL),
  });
} else {
  // Provide mock implementations for SSR
  paymasterClient = {} as ReturnType<typeof createPaymasterClient>;
  bundler = {} as ReturnType<typeof createBundlerClient>;
  pimlicoClient = {} as ReturnType<typeof createPimlicoClient>;
}

// Export the clients
export { paymasterClient, bundler, pimlicoClient };

export const sendUserOp = async (
  smartAccount: MetaMaskSmartAccount<Implementation.Hybrid>,
  calls: readonly unknown[]
) => {
  const { fast: fees } = await pimlicoClient.getUserOperationGasPrice();

  const userOpHash = await bundler.sendUserOperation({
    account: smartAccount,
    calls,
    ...fees,
  });

  const receipt = await bundler.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  return receipt;
};
