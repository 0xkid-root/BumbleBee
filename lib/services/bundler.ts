import type {
  Implementation,
  MetaMaskSmartAccount,
} from "@metamask/delegation-toolkit";
import { sepolia as chain } from "wagmi/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import {
  createBundlerClient,
  createPaymasterClient,
} from "viem/account-abstraction";
import { http } from "viem";






// Default bundler URL if environment variable is not set
const pimlicoKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
console.log(pimlicoKey,"pimlicoKey");

console.log(chain,"chainis here")



// Create clients only if we're in a browser environment to avoid SSR issues
let paymasterClient: ReturnType<typeof createPaymasterClient>;
let bundler: ReturnType<typeof createBundlerClient>;
let pimlicoClient: ReturnType<typeof createPimlicoClient>;

  if (typeof window !== 'undefined') {
    paymasterClient = createPaymasterClient({
      transport: http(process.env.NEXT_PUBLIC_PIMLICO_API_KEY),
    });

    bundler = createBundlerClient({
      transport: http(process.env.NEXT_PUBLIC_PIMLICO_API_KEY),
      paymaster: paymasterClient,
      chain,
    });

    pimlicoClient = createPimlicoClient({
      transport: http(process.env.NEXT_PUBLIC_PIMLICO_API_KEY),
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
  console.log(userOpHash,"hii ");

  const receipt = await bundler.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  console.log(receipt);


  return receipt;
};
