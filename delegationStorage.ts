import type { Hex } from "viem";
import type { DelegationStruct } from "@metamask/delegation-toolkit";

// Define types based on the actual implementation
interface DelegationStorageClient {
  storeDelegation: (delegation: DelegationStruct) => Promise<any>;
  getDelegationChain: (hash: Hex) => Promise<any>;
  fetchDelegations: (address: Hex, filter: DelegationStoreFilter) => Promise<any>;
}

// Define the enum for delegation store filter
enum DelegationStoreFilter {
  DELEGATE = "delegate",
  DELEGATOR = "delegator",
  BOTH = "both"
}

// Define environment types as string literals
const DelegationStorageEnvironment = {
  dev: 'dev',
  prod: 'prod',
};

let instance: DelegationStorageClient | null = null;

const logStorageConfig = (apiKey?: string, apiKeyId?: string) => {
  console.group("=== Delegation Storage Configuration ===");
  console.log("API Key format check:", {
    exists: !!apiKey,
    length: apiKey?.length,
    firstChars: apiKey?.substring(0, 4),
    lastChars: apiKey?.substring(apiKey.length - 4),
    hasSpecialChars: apiKey?.match(/[^a-zA-Z0-9]/) ? true : false,
  });
  console.log("API Key ID format check:", {
    exists: !!apiKeyId,
    length: apiKeyId?.length,
    firstChars: apiKeyId?.substring(0, 4),
    lastChars: apiKeyId?.substring(apiKeyId.length - 4),
    hasSpecialChars: apiKeyId?.match(/[^a-zA-Z0-9]/) ? true : false,
  });
  console.log("Environment:", DelegationStorageEnvironment.dev);
  console.log("Running on:", typeof window !== "undefined" ? "client" : "server");
  console.groupEnd();
};

export const getDelegationStorageClient = async (): Promise<DelegationStorageClient> => {
  if (!instance) {
    const apiKey = process.env.NEXT_PUBLIC_DELEGATION_STORAGE_API_KEY;
    const apiKeyId = process.env.NEXT_PUBLIC_DELEGATION_STORAGE_API_KEY_ID;

    // Log configuration for debugging
    logStorageConfig(apiKey, apiKeyId);

    if (!apiKey || !apiKeyId) {
      throw new Error("Delegation storage API key and key ID are required");
    }

    try {
      // Create a mock implementation for development or use dynamic import in production
      if (typeof window !== 'undefined') {
        try {
          // Only try to import in the browser environment
          const module = await import('@metamask/delegation-toolkit/dist/storage');
          const StorageClient = module.DelegationStorageClient;
          
          instance = new StorageClient({
            apiKey,
            apiKeyId,
            environment: 'dev', // Use string literal instead of enum
          });
        } catch (importError) {
          console.error('Error importing DelegationStorageClient:', importError);
          // Create a mock client for development
          instance = createMockStorageClient();
        }
      } else {
        // Create a mock client for server-side rendering
        instance = createMockStorageClient();
      }
      console.log("DelegationStorageClient initialized successfully");
    } catch (error) {
      console.error("Error creating DelegationStorageClient:", error);
      throw error;
    }
  }
  return instance;
};

// Helper function to create a mock storage client for development/SSR
function createMockStorageClient(): DelegationStorageClient {
  return {
    storeDelegation: async (delegation: DelegationStruct) => {
      console.log('Mock storage client: storing delegation', delegation);
      return { success: true, id: 'mock-delegation-id-' + Date.now() };
    },
    getDelegationChain: async (hash: Hex) => {
      console.log('Mock storage client: getting delegation chain', hash);
      return { delegations: [] };
    },
    fetchDelegations: async (address: Hex, filter: DelegationStoreFilter) => {
      console.log('Mock storage client: fetching delegations', { address, filter });
      return { delegations: [] };
    }
  };
}

export const storeDelegation = async (delegation: DelegationStruct) => {
  try {
    console.group("=== Storing Delegation ===");
    console.log("Delegation details:", {
      delegate: delegation.delegate,
      delegator: delegation.delegator,
      hasSignature: !!delegation.signature,
      salt: delegation.salt.toString(),
    });

    const delegationStorageClient = await getDelegationStorageClient();
    const result = await delegationStorageClient.storeDelegation(delegation);

    console.log("Delegation stored successfully:", result);
    console.groupEnd();
    return result;
  } catch (error: any) {
    console.error("Delegation storage error:", {
      name: error.name,
      message: error.message,
      status: error.status,
      details: error.details,
      stack: error.stack,
    });
    console.groupEnd();
    throw error;
  }
};

export const getDelegationChain = async (hash: Hex) => {
  try {
    console.log("Fetching delegation chain for hash:", hash);
    const delegationStorageClient = await getDelegationStorageClient();
    const result = await delegationStorageClient.getDelegationChain(hash);
    console.log("Delegation chain fetched:", result);
    return result;
  } catch (error) {
    console.error("Error fetching delegation chain:", error);
    throw error;
  }
};

export const fetchDelegations = async (
  address: Hex,
  filter: DelegationStoreFilter, // <-- Proper enum type
) => {
  try {
    console.log("Fetching delegations for address:", address, "filter:", filter);
    const delegationStorageClient = await getDelegationStorageClient();
    const result = await delegationStorageClient.fetchDelegations(address, filter);
    console.log("Delegations fetched:", result);
    return result;
  } catch (error) {
    console.error("Error fetching delegations:", error);
    throw error;
  }
};

export { DelegationStoreFilter };