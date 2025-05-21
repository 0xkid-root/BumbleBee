import { 
  createWalletClient, 
  custom, 
  createPublicClient, 
  http,
  type Account 
} from "viem";
import { sepolia as chain } from "viem/chains";
import { 
  toMetaMaskSmartAccount,
  Implementation 
} from "@metamask/delegation-toolkit";
import { erc7715ProviderActions } from "@metamask/delegation-toolkit/experimental";
// Create public client
export const publicClient = createPublicClient({
  chain,
  transport: http()
});

// Create session account factory
export async function createSessionAccount(signatory: Account) {
  return await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [signatory.address, [], [], []],
    deploySalt: "0x",
    signatory: { account: signatory }
  });
}

// Create wallet client with ERC-7715 actions
export const walletClient = createWalletClient({
  transport: custom((window as any).ethereum),
  chain
}).extend(erc7715ProviderActions());

// Stream configuration constants
export const SECONDS_IN_WEEK = 604_800;
export const SECONDS_IN_MONTH = SECONDS_IN_WEEK * 4;