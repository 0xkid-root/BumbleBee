import type {
  Implementation,
  MetaMaskSmartAccount,
} from "@metamask/delegation-toolkit";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import {
  createBundlerClient,
  createPaymasterClient,
} from "viem/account-abstraction";
import { http } from "viem";

// Default bundler URL if environment variable is not set
const BUNDLER_URL = "https://api.pimlico.io/v2/11155111/rpc?apikey=pim_dLoZZrLYBZNJ91bN3zGTtw";
const pimlicoKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;

// Create clients only if we're in a browser environment to avoid SSR issues
let paymasterClient: ReturnType<typeof createPaymasterClient>;
let bundler: ReturnType<typeof createBundlerClient>;
let pimlicoClient: ReturnType<typeof createPimlicoClient>;

export const initializeBundler = (chainId: number) => {
  if (typeof window !== 'undefined') {
    paymasterClient = createPaymasterClient({
      transport: http(`https://api.pimlico.io/v2/${chainId}/rpc?apikey=${pimlicoKey}`),
    });

    bundler = createBundlerClient({
      transport: http(`https://api.pimlico.io/v2/${chainId}/rpc?apikey=${pimlicoKey}`),
      paymaster: paymasterClient,
      chainId,
    });

    pimlicoClient = createPimlicoClient({
      transport: http(`https://api.pimlico.io/v2/${chainId}/rpc?apikey=${pimlicoKey}`),
    });
  } else {
    // Provide mock implementations for SSR
    paymasterClient = {} as ReturnType<typeof createPaymasterClient>;
    bundler = {} as ReturnType<typeof createBundlerClient>;
    pimlicoClient = {} as ReturnType<typeof createPimlicoClient>;
  }
};

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
  console.log(userOpHash,"hii ");

  const receipt = await bundler.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  console.log(receipt);


  return receipt;
};
