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

export const paymasterClient = createPaymasterClient({
  transport: http(process.env.NEXT_PUBLIC_PIMLICO_API_KEY),
});

export const bundler = createBundlerClient({
  transport: http(process.env.NEXT_PUBLIC_PIMLICO_API_KEY),
  paymaster: paymasterClient,
  chain,
});

export const pimlicoClient = createPimlicoClient({
  transport: http(process.env.NEXT_PUBLIC_PIMLICO_API_KEY),
});

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
