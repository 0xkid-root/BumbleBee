import { http, createPublicClient } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { lineaSepolia as chain } from "viem/chains";
import type { SignableMessage } from "viem";
import { 
  Implementation, 
  toMetaMaskSmartAccount, 
} from "@metamask/delegation-toolkit";

// Create a public client for interacting with the blockchain
const transport = http();
export const publicClient = createPublicClient({
  transport,
  chain,
});

// Generate a private key for the owner account if not provided
const generateOwnerAccount = () => {
  const privateKey = generatePrivateKey();
  return privateKeyToAccount(privateKey);
};

/**
 * Creates a MetaMask smart account using the delegation toolkit
 * @param params Configuration parameters for the smart account
 * @returns The created smart account
 */
export async function createMetaMaskSmartAccount(params?: {
  ownerAddress?: `0x${string}`;
  deploySalt?: `0x${string}`;
  implementation?: string;
  signers?: `0x${string}`[];
  threshold?: number;
}) {
  try {
    // Generate or use provided owner account with required signMessage and signTypedData methods
    const owner = params?.ownerAddress 
      ? { 
          address: params.ownerAddress,
          signMessage: async ({ message }: { message: SignableMessage }) => {
            console.log("Signing message for", params.ownerAddress, ":", message);
            return `0x${Math.random().toString(16).substring(2, 130)}` as `0x${string}`;
          },
          signTypedData: async (data: any) => {
            console.log("Signing typed data for", params.ownerAddress, ":", data);
            return `0x${Math.random().toString(16).substring(2, 130)}` as `0x${string}`;
          }
        } 
      : generateOwnerAccount();
    
    // Default salt for deterministic deployment
    const deploySalt = params?.deploySalt || "0x";
    
    // Determine implementation type
    const implementationType = params?.implementation === "Multisig" 
      ? Implementation.MultiSig 
      : Implementation.Hybrid;
    
    let smartAccount;
    
    if (implementationType === Implementation.Hybrid) {
      // Create a Hybrid smart account
      smartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.Hybrid,
        deployParams: [owner.address, [], [], []], // Basic initialization parameters
        deploySalt,
        signatory: { account: owner },
      });
    } else if (implementationType === Implementation.MultiSig) {
      // Validate multisig parameters
      if (!params?.signers || params.signers.length === 0 || !params.threshold) {
        throw new Error("Signers and threshold are required for Multisig accounts");
      }
      
      // Create a mock account for each signer
      const signatories = params.signers.map(signerAddress => ({
        account: {
          address: signerAddress,
          signMessage: async ({ message }: { message: SignableMessage }) => {
            console.log("Signing message for", signerAddress, ":", message);
            return `0x${Math.random().toString(16).substring(2, 130)}` as `0x${string}`;
          },
          signTypedData: async (data: any) => {
            console.log("Signing typed data for", signerAddress, ":", data);
            return `0x${Math.random().toString(16).substring(2, 130)}` as `0x${string}`;
          }
        }
      }));
      
      // Create a Multisig smart account
      smartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.MultiSig,
        deployParams: [params.signers, BigInt(params.threshold)], // Multisig parameters
        deploySalt,
        signatory: signatories,
      });
    } else {
      throw new Error("Invalid implementation type");
    }
    
    return {
      address: smartAccount.address,
      owner: owner.address,
      implementation: implementationType,
    };
  } catch (error) {
    console.error("Failed to create MetaMask smart account:", error);
    throw error;
  }
}