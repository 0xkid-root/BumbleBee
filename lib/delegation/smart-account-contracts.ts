import { ethers } from 'ethers';
import { Address } from 'viem';

// ABI imports will be generated from contract compilation
// For now, we'll use placeholder ABIs
const BumbleBeeSmartAccountABI = [
  // Basic functions
  "function execute(address target, uint256 value, bytes calldata data) external returns (bytes memory)",
  "function executeViaDelegation(bytes32 delegationId, address target, uint256 value, bytes calldata data, bytes calldata signature) external returns (bytes memory)",
  "function executeViaSessionKey(bytes32 sessionKeyId, address target, uint256 value, bytes calldata data, bytes calldata signature) external returns (bytes memory)",
  
  // Delegation functions
  "function createDelegation(address delegate, uint256 expiresAt, tuple(bytes32 caveatType, bytes terms)[] calldata caveats) external returns (bytes32)",
  "function revokeDelegation(bytes32 delegationId) external",
  
  // Session key functions
  "function createSessionKey(bytes calldata publicKey, uint256 expiresAt) external returns (bytes32)",
  "function revokeSessionKey(bytes32 sessionKeyId) external",
  
  // Passkey functions
  "function registerPasskey(bytes calldata publicKey) external returns (bytes32)",
  "function revokePasskey(bytes32 passkeyId) external",
  
  // ERC-4337 functions
  "function validateUserOp(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature) calldata userOp, bytes32 userOpHash, uint256 missingAccountFunds) external returns (uint256)",
  "function getNonce() external view returns (uint256)",
  
  // ERC-1271 functions
  "function isValidSignature(bytes32 hash, bytes calldata signature) external view returns (bytes4)",
  
  // ERC-7715 functions
  "function grantPermission(address delegate, string calldata permissionType, bytes calldata data, uint256 expiry, bytes calldata context) external returns (bytes32)",
  "function revokePermission(bytes32 permissionId) external",
  
  // ERC-5792 functions
  "function executeCalls(tuple(address to, uint256 value, bytes data, bytes capabilities)[] calldata calls, bool atomicRequired) external returns (bytes32, bytes[])",
  
  // Events
  "event DelegationCreated(address indexed delegator, address indexed delegate, bytes32 delegationId, uint256 expiresAt)",
  "event DelegationRevoked(address indexed delegator, address indexed delegate, bytes32 delegationId)",
  "event SessionKeyCreated(bytes32 indexed sessionKeyId, address indexed owner, uint256 expiresAt)",
  "event SessionKeyRevoked(bytes32 indexed sessionKeyId, address indexed owner)",
  "event PasskeyRegistered(bytes32 indexed passkeyId, address indexed owner)",
  "event PasskeyRevoked(bytes32 indexed passkeyId, address indexed owner)",
  "event PermissionGranted(address indexed delegator, address indexed delegate, bytes32 indexed permissionId, bytes context)",
  "event PermissionRevoked(address indexed delegator, address indexed delegate, bytes32 indexed permissionId)",
  "event CallsExecuted(bytes32 indexed batchId, address indexed from, address[] to, uint256[] values, bytes[] data)"
];

const BumbleBeeSmartAccountFactoryABI = [
  "function createSmartAccount(address owner, bytes32 salt) external returns (address)",
  "function registerSmartAccount(address owner, address smartAccount) external",
  "function getSmartAccounts(address owner) external view returns (address[])",
  "function computeSmartAccountAddress(address owner, bytes32 salt) external view returns (address)",
  "function createSmartAccountWithInitCode(address owner, bytes32 salt) external returns (address, bytes)",
  "function createSmartAccountWithPermission(address owner, address delegate, string calldata permissionType, bytes calldata permissionData, uint256 expiry, bytes32 salt) external returns (address, bytes32)",
  
  // Events
  "event SmartAccountCreated(address indexed owner, address indexed smartAccount, bytes32 salt)",
  "event SmartAccountRegistered(address indexed owner, address indexed smartAccount)",
  "event AccountDeployed(address indexed account, address indexed owner, address indexed entryPoint)"
];

const BumbleBeeSessionKeyManagerABI = [
  "function registerSessionKey(bytes calldata publicKey, uint256 expiresAt) external returns (bytes32)",
  "function revokeSessionKey(bytes32 keyId) external",
  "function registerPasskey(bytes calldata publicKey, bytes calldata credentialId) external returns (bytes32)",
  "function revokePasskey(bytes32 keyId) external",
  "function grantPermission(bytes32 keyId, address target, bytes4 selector) external",
  "function revokePermission(bytes32 keyId, address target, bytes4 selector) external",
  "function hasPermission(bytes32 keyId, address target, bytes4 selector) external view returns (bool)",
  "function getUserSessionKeys(address owner) external view returns (bytes32[])",
  "function getUserPasskeys(address owner) external view returns (bytes32[])"
];

const BumbleBeeDelegationManagerABI = [
  "function createDelegation(address delegate, uint256 expiresAt, bytes calldata signature) external returns (bytes32)",
  "function addCaveat(bytes32 delegationId, bytes32 caveatType, bytes calldata terms, address enforcer) external",
  "function revokeDelegation(bytes32 delegationId) external",
  "function redeemDelegation(bytes32 delegationId) external",
  "function verifyDelegation(bytes32 delegationId) external view returns (bool)",
  "function getDelegationCaveats(bytes32 delegationId) external view returns (tuple(bytes32 caveatType, bytes terms, address enforcer)[])",
  "function getDelegatorDelegations(address delegator) external view returns (bytes32[])",
  "function getDelegateDelegations(address delegate) external view returns (bytes32[])"
];

// Contract addresses - these would be set after deployment
const CONTRACT_ADDRESSES = {
  SMART_ACCOUNT_FACTORY: "0x0000000000000000000000000000000000000000",
  SESSION_KEY_MANAGER: "0x0000000000000000000000000000000000000000",
  DELEGATION_MANAGER: "0x0000000000000000000000000000000000000000"
};

// Types
export interface SmartAccountParams {
  owner: Address;
  salt?: string;
}

export interface DelegationParams {
  delegator: Address;
  delegate: Address;
  expiresAt: number;
  caveats?: Array<{
    caveatType: string;
    terms: string;
  }>;
}

export interface SessionKeyParams {
  owner: Address;
  publicKey: string;
  expiresAt: number;
}

export interface PasskeyParams {
  owner: Address;
  publicKey: string;
  credentialId: string;
}

export interface ExecuteParams {
  target: Address;
  value: string;
  data: string;
  delegationId?: string;
  sessionKeyId?: string;
  signature?: string;
}

// ERC-4337 Types
export interface UserOperation {
  sender: Address;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
}

// ERC-7715 Types
export interface PermissionParams {
  delegate: Address;
  permissionType: string;
  data: string;
  expiry: number;
  context?: string;
}

// ERC-5792 Types
export interface CallParams {
  to: Address;
  value: string;
  data: string;
  capabilities?: string;
}

export interface ExecuteCallsParams {
  calls: CallParams[];
  atomicRequired: boolean;
}

// Smart Account Service
export class SmartAccountService {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;
  private factoryContract: ethers.Contract;
  private sessionKeyManagerContract: ethers.Contract;
  private delegationManagerContract: ethers.Contract;
  
  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.signer = provider.getSigner();
    
    this.factoryContract = new ethers.Contract(
      CONTRACT_ADDRESSES.SMART_ACCOUNT_FACTORY,
      BumbleBeeSmartAccountFactoryABI,
      this.signer
    );
    
    this.sessionKeyManagerContract = new ethers.Contract(
      CONTRACT_ADDRESSES.SESSION_KEY_MANAGER,
      BumbleBeeSessionKeyManagerABI,
      this.signer
    );
    
    this.delegationManagerContract = new ethers.Contract(
      CONTRACT_ADDRESSES.DELEGATION_MANAGER,
      BumbleBeeDelegationManagerABI,
      this.signer
    );
  }
  
  // Smart Account Factory methods
  async createSmartAccount(params: SmartAccountParams): Promise<string> {
    try {
      const salt = params.salt || ethers.utils.randomBytes(32);
      const tx = await this.factoryContract.createSmartAccount(params.owner, salt);
      const receipt = await tx.wait();
      
      const event = receipt.events?.find((e: any) => e.event === 'SmartAccountCreated');
      return event?.args?.smartAccount || '';
    } catch (error) {
      console.error('Error creating smart account:', error);
      throw error;
    }
  }
  
  async getSmartAccounts(owner: Address): Promise<string[]> {
    try {
      return await this.factoryContract.getSmartAccounts(owner);
    } catch (error) {
      console.error('Error getting smart accounts:', error);
      throw error;
    }
  }
  
  async computeSmartAccountAddress(params: SmartAccountParams): Promise<string> {
    try {
      const salt = params.salt || ethers.utils.randomBytes(32);
      return await this.factoryContract.computeSmartAccountAddress(params.owner, salt);
    } catch (error) {
      console.error('Error computing smart account address:', error);
      throw error;
    }
  }
  
  // Smart Account methods
  async getSmartAccountContract(address: string): Promise<ethers.Contract> {
    return new ethers.Contract(
      address,
      BumbleBeeSmartAccountABI,
      this.signer
    );
  }
  
  // ERC-4337 methods
  async createUserOperation(smartAccountAddress: string, params: ExecuteParams): Promise<UserOperation> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      const nonce = await smartAccount.getNonce();
      
      // Create calldata
      let callData;
      if (params.delegationId && params.signature) {
        callData = smartAccount.interface.encodeFunctionData('executeViaDelegation', [
          params.delegationId,
          params.target,
          ethers.utils.parseEther(params.value),
          params.data,
          params.signature
        ]);
      } else if (params.sessionKeyId && params.signature) {
        callData = smartAccount.interface.encodeFunctionData('executeViaSessionKey', [
          params.sessionKeyId,
          params.target,
          ethers.utils.parseEther(params.value),
          params.data,
          params.signature
        ]);
      } else {
        callData = smartAccount.interface.encodeFunctionData('execute', [
          params.target,
          ethers.utils.parseEther(params.value),
          params.data
        ]);
      }
      
      // Create UserOperation
      const userOp: UserOperation = {
        sender: smartAccountAddress as Address,
        nonce: nonce.toHexString(),
        initCode: '0x',
        callData,
        callGasLimit: '0x100000',
        verificationGasLimit: '0x100000',
        preVerificationGas: '0x50000',
        maxFeePerGas: '0x' + (await this.provider.getGasPrice()).toHexString(),
        maxPriorityFeePerGas: '0x1',
        paymasterAndData: '0x',
        signature: '0x'
      };
      
      return userOp;
    } catch (error) {
      console.error('Error creating user operation:', error);
      throw error;
    }
  }
  
  // ERC-7715 methods
  async grantPermission(smartAccountAddress: string, params: PermissionParams): Promise<string> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      const tx = await smartAccount.grantPermission(
        params.delegate,
        params.permissionType,
        params.data,
        params.expiry,
        params.context || '0x'
      );
      
      const receipt = await tx.wait();
      const event = receipt.events?.find((e: any) => e.event === 'PermissionGranted');
      return event?.args?.permissionId || '';
    } catch (error) {
      console.error('Error granting permission:', error);
      throw error;
    }
  }
  
  async revokePermission(smartAccountAddress: string, permissionId: string): Promise<boolean> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      const tx = await smartAccount.revokePermission(permissionId);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error('Error revoking permission:', error);
      throw error;
    }
  }
  
  // ERC-5792 methods
  async executeCalls(smartAccountAddress: string, params: ExecuteCallsParams): Promise<{batchId: string, results: string[]}> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      const calls = params.calls.map(call => ({
        to: call.to,
        value: ethers.utils.parseEther(call.value),
        data: call.data,
        capabilities: call.capabilities || '0x'
      }));
      
      const tx = await smartAccount.executeCalls(calls, params.atomicRequired);
      const receipt = await tx.wait();
      
      const event = receipt.events?.find((e: any) => e.event === 'CallsExecuted');
      return {
        batchId: event?.args?.batchId || '',
        results: event?.args?.results || []
      };
    } catch (error) {
      console.error('Error executing calls:', error);
      throw error;
    }
  }
  
  async execute(smartAccountAddress: string, params: ExecuteParams): Promise<string> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      let tx;
      if (params.delegationId && params.signature) {
        tx = await smartAccount.executeViaDelegation(
          params.delegationId,
          params.target,
          ethers.utils.parseEther(params.value),
          params.data,
          params.signature
        );
      } else if (params.sessionKeyId && params.signature) {
        tx = await smartAccount.executeViaSessionKey(
          params.sessionKeyId,
          params.target,
          ethers.utils.parseEther(params.value),
          params.data,
          params.signature
        );
      } else {
        tx = await smartAccount.execute(
          params.target,
          ethers.utils.parseEther(params.value),
          params.data
        );
      }
      
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  }
  
  // Delegation methods
  async createDelegation(smartAccountAddress: string, params: DelegationParams): Promise<string> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      const caveats = params.caveats || [];
      const tx = await smartAccount.createDelegation(
        params.delegate,
        params.expiresAt,
        caveats
      );
      
      const receipt = await tx.wait();
      const event = receipt.events?.find((e: any) => e.event === 'DelegationCreated');
      return event?.args?.delegationId || '';
    } catch (error) {
      console.error('Error creating delegation:', error);
      throw error;
    }
  }
  
  async revokeDelegation(smartAccountAddress: string, delegationId: string): Promise<boolean> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      const tx = await smartAccount.revokeDelegation(delegationId);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error('Error revoking delegation:', error);
      throw error;
    }
  }
  
  // Session Key methods
  async createSessionKey(smartAccountAddress: string, params: SessionKeyParams): Promise<string> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      const tx = await smartAccount.createSessionKey(
        params.publicKey,
        params.expiresAt
      );
      
      const receipt = await tx.wait();
      const event = receipt.events?.find((e: any) => e.event === 'SessionKeyCreated');
      return event?.args?.sessionKeyId || '';
    } catch (error) {
      console.error('Error creating session key:', error);
      throw error;
    }
  }
  
  async revokeSessionKey(smartAccountAddress: string, sessionKeyId: string): Promise<boolean> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      const tx = await smartAccount.revokeSessionKey(sessionKeyId);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error('Error revoking session key:', error);
      throw error;
    }
  }
  
  // Passkey methods
  async registerPasskey(smartAccountAddress: string, params: PasskeyParams): Promise<string> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      const tx = await smartAccount.registerPasskey(params.publicKey);
      
      const receipt = await tx.wait();
      const event = receipt.events?.find((e: any) => e.event === 'PasskeyRegistered');
      return event?.args?.passkeyId || '';
    } catch (error) {
      console.error('Error registering passkey:', error);
      throw error;
    }
  }
  
  async revokePasskey(smartAccountAddress: string, passkeyId: string): Promise<boolean> {
    try {
      const smartAccount = await this.getSmartAccountContract(smartAccountAddress);
      
      const tx = await smartAccount.revokePasskey(passkeyId);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error('Error revoking passkey:', error);
      throw error;
    }
  }
}

// Export a function to create the service
export function createSmartAccountService(provider: ethers.providers.Web3Provider): SmartAccountService {
  return new SmartAccountService(provider);
}
