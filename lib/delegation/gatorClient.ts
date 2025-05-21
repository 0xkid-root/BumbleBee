import { 
  Address, 
  createPublicClient, 
  http, 
  Hex,
  type SignableMessage
} from "viem";
import { lineaSepolia } from "viem/chains";
import { Network } from "../bumblebee-sdk";
import { PasskeyCredential } from "../webauthn";
// We'll define our own call type since viem/actions doesn't export Call
import {
  Implementation,
  toMetaMaskSmartAccount,
  createDelegation as createGatorDelegation
} from "@metamask/delegation-toolkit";

// Define our own types for delegation and calls
export interface GatorDelegationCaveat {
  type: string;
  name?: string;
  value?: any;
  enforcer?: `0x${string}`;
  terms?: any;
  args?: any[] | string;
}

// Define a simplified Call type for our use case
export interface Call {
  to: Address;
  value?: bigint;
  data?: string;
  abi?: readonly unknown[];
  functionName?: string;
  args?: readonly unknown[];
}

// Types
export interface SessionKey {
  id: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface UserOperationParams {
  sender: Address;
  target?: Address;
  value?: bigint;
  data?: string;
  sessionKey?: string;
  passkey?: PasskeyCredential;
  waitForReceipt?: boolean;
}

export interface DelegationParams {
  delegator: Address;
  delegate?: Address;
  delegationId?: string;
  sessionKey?: string;
  passkey?: PasskeyCredential;
  caveats?: GatorDelegationCaveat[];
}

export interface SmartAccountParams {
  address: Address;
  chainId: number;
  sessionKey?: SessionKey;
  passkey?: PasskeyCredential;
}

// State management
let bundlerConnected = false;
let entryPointContract: any = null;
let publicClient: any = null;
let smartAccount: any = null;

/**
 * Initialize the public client for the given chain
 */
export function initializePublicClient(chainId: number = 11155111) { // Default to Sepolia
  // Use Sepolia for development
  const chain = lineaSepolia;
  
  publicClient = createPublicClient({
    chain,
    transport: http()
  });
  
  console.log(`Public client initialized for chain ${chain.name}`);
  return publicClient;
}

/**
 * Connect to the bundler for sending user operations
 */
export async function connectBundler(address: Address, chainId: number): Promise<boolean> {
  console.log(`Connecting to bundler for address ${address} on chain ${chainId}...`);
  
  // Initialize public client if not already done
  if (!publicClient) {
    initializePublicClient(chainId);
  }
  
  bundlerConnected = true;
  console.log("Connected to bundler successfully");
  
  return true;
}

/**
 * Get the entry point contract for the current chain
 */
export async function getEntryPointContract(chainId: number): Promise<any> {
  if (!bundlerConnected) {
    throw new Error("Bundler not connected. Call connectBundler first.");
  }
  
  // Mock contract based on chainId for now
  // In a real implementation, this would get the actual EntryPoint contract
  entryPointContract = {
    address: chainId === 1 ? "0xENTRYPOINT_MAINNET" : "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // Sepolia EntryPoint
    abi: ["function executeUserOperation(bytes calldata)"],
    chainId
  };
  
  return entryPointContract;
}

/**
 * Create a new session key for delegation
 */
export async function createSessionKey(address: Address): Promise<SessionKey> {
  if (!bundlerConnected) {
    await connectBundler(address, 11155111); // Default to Sepolia
  }
  
  // Generate a random key pair for the session
  // In a real implementation, this would use proper cryptography
  const id = `sk-${Math.random().toString(36).substring(2, 15)}`;
  const publicKey = `0x${Math.random().toString(16).substring(2, 66)}` as Hex;
  const privateKey = `0x${Math.random().toString(16).substring(2, 66)}` as Hex;
  
  const sessionKey: SessionKey = {
    id,
    publicKey,
    privateKey,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  };
  
  console.log("Created session key:", sessionKey.id);
  return sessionKey;
}

/**
 * Create a MetaMask Smart Account for delegation
 */
export async function createMetaMaskSmartAccount(params: SmartAccountParams): Promise<any> {
  if (!bundlerConnected) {
    await connectBundler(params.address, params.chainId);
  }

  try {
    // Initialize the client if not already done
    if (!publicClient) {
      initializePublicClient(params.chainId);
    }

    // Create a mock account for development that conforms to the expected interface
    const mockAccount = {
      address: params.address,
      // This signature matches what viem expects for Account.signMessage
      signMessage: async (params: { message: SignableMessage }) => {
        // Convert any message format to a string for logging
        const messageStr = typeof params.message === 'string' 
          ? params.message 
          : 'object' in params.message 
            ? JSON.stringify(params.message.object)
            : params.message.raw.toString();
            
        console.log("Signing message:", messageStr);
        return `0x${Math.random().toString(16).substring(2, 130)}` as Hex;
      },
      signTypedData: async (params: any) => {
        console.log("Signing typed data:", params);
        return `0x${Math.random().toString(16).substring(2, 130)}` as Hex;
      }
    };

    // Create a salt for deterministic deployment
    const deploySalt = "0x00" as Hex;

    // Create the smart account
    console.log("Creating MetaMask Smart Account...");
    smartAccount = await toMetaMaskSmartAccount({
      client: publicClient,
      implementation: Implementation.Hybrid,
      deployParams: [params.address, [], [], []],
      deploySalt,
      signatory: { account: mockAccount },
    });

    console.log("Smart Account created:", smartAccount.address);
    return smartAccount;
  } catch (error) {
    console.error("Failed to create MetaMask Smart Account:", error);
    throw error;
  }
}

/**
 * Create a delegation from the smart account
 */
export async function createDelegation(params: DelegationParams): Promise<any> {
  if (!smartAccount) {
    throw new Error("Smart Account not created. Call createMetaMaskSmartAccount first.");
  }

  try {
    // Create the delegation
    const delegateAddress = params.delegate || "0x2FcB88EC2359fA635566E66415D31dD381CF5585";
    
    // Transform our caveats to match the expected format
    const formattedCaveats = (params.caveats || []).map(caveat => {
      // Ensure args is a properly formatted hex string
      let argsValue: `0x${string}` = "0x";
      if (caveat.args) {
        if (typeof caveat.args === 'string' && caveat.args.startsWith('0x')) {
          argsValue = caveat.args as `0x${string}`;
        } else if (Array.isArray(caveat.args)) {
          // If it's an array, convert to a hex string (empty for now)
          argsValue = "0x";
        }
      }
      
      // Ensure terms is a properly formatted value
      let termsValue: any = "0x";
      if (caveat.terms) {
        termsValue = caveat.terms;
      } else if (caveat.value) {
        termsValue = caveat.value;
      }
      
      return {
        enforcer: caveat.enforcer || "0x0000000000000000000000000000000000000000" as `0x${string}`,
        terms: termsValue,
        args: argsValue
      };
    });

    console.log("Creating delegation to:", delegateAddress);
    const delegation = createGatorDelegation({
      to: delegateAddress as Address,
      from: smartAccount.address,
      caveats: formattedCaveats
    });

    // Sign the delegation
    console.log("Signing delegation...");
    const signature = await smartAccount.signDelegation({ delegation });
    
    const signedDelegation = {
      ...delegation,
      signature
    };

    console.log("Delegation created and signed:", signedDelegation);
    return signedDelegation;
  } catch (error) {
    console.error("Failed to create delegation:", error);
    throw error;
  }
}

/**
 * Send a user operation through the bundler
 */
export async function sendUserOperation(params: UserOperationParams): Promise<{ hash: string, transactionHash?: string }> {
  if (!bundlerConnected) {
    await connectBundler(params.sender, 11155111); // Default to Sepolia
  }
  
  console.log("Sending user operation:", params);
  
  try {
    // Import the bundler and pimlicoClient from the services
    const { bundler, pimlicoClient } = await import('../services/bundler');
    
    if (!smartAccount) {
      throw new Error("Smart Account not created. Call createMetaMaskSmartAccount first.");
    }
    
    // Get the gas price from Pimlico
    const { fast: fee } = await pimlicoClient.getUserOperationGasPrice();
    
    // Import necessary types and functions
    const { encodeFunctionData, parseAbi } = await import('viem');
    
    // Define a properly typed calls array that matches what the bundler expects
    const calls: Call[] = [];
    
    // If target and data are provided, add them to the calls
    if (params.target) {
      // For ETH transfers, we create a properly formatted call object
      // that matches the Call type from viem/actions
      calls.push({
        to: params.target,
        value: params.value || BigInt(0),
        // We need to provide an ABI and functionName for the call to be valid
        abi: parseAbi(['function transfer()']),
        functionName: 'transfer',
        // Empty args array for a simple transfer
        args: []
      });
    }
    
    // Send the user operation with the properly typed calls array
    // We need to use type assertion here because the bundler expects a specific format
    const userOperationHash = await bundler.sendUserOperation({
      account: smartAccount,
      calls: calls as any, // Type assertion is necessary due to complex type constraints
      ...fee
    });
    
    console.log("User operation sent with hash:", userOperationHash);
    
    // Wait for the receipt
    const { receipt } = await bundler.waitForUserOperationReceipt({
      hash: userOperationHash
    });
    
    console.log("Transaction confirmed with hash:", receipt.transactionHash);
    
    return {
      hash: userOperationHash,
      transactionHash: receipt.transactionHash
    };
  } catch (error) {
    console.error("Failed to send user operation:", error);
    throw error;
  }
}

/**
 * Redeem permissions from a delegation
 */
export async function redeemPermissions(params: DelegationParams): Promise<boolean> {
  if (!bundlerConnected) {
    await connectBundler(params.delegator, 11155111); // Default to Sepolia
  }
  
  console.log("Redeeming permissions:", params);
  
  try {
    // In a real implementation, this would use the delegation to redeem permissions
    // For now, we'll simulate it
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Permissions redeemed successfully");
    return true;
  } catch (error) {
    console.error("Failed to redeem permissions:", error);
    throw error;
  }
}

/**
 * Revoke a delegation
 */
export async function revokeDelegation(params: DelegationParams): Promise<boolean> {
  if (!bundlerConnected) {
    await connectBundler(params.delegator, 11155111); // Default to Sepolia
  }
  
  console.log("Revoking delegation:", params);
  
  try {
    // In a real implementation, this would use the smart account to revoke the delegation
    // For now, we'll simulate it
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Delegation revoked successfully");
    return true;
  } catch (error) {
    console.error("Failed to revoke delegation:", error);
    throw error;
  }
}
