import { ethers } from 'ethers';
import { Address } from 'viem';
import { SmartAccountService, createSmartAccountService } from './smart-account-contracts';
import { PasskeyCredential } from '../webauthn';
import { DelegationCaveat, CaveatType } from '@/components/wallet/delegation-types';
import { DelegationStatus } from '@/components/wallet';

// Define SessionKey interface since it's not exported from webauthn
export interface SessionKey {
  id: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Types
export interface SmartAccountDetails {
  id: string;
  address: string;
  name: string;
  type: 'EOA' | 'Smart' | 'Delegate';
  balance: number;
  createdAt: Date;
  status: 'Active' | 'Pending' | 'Inactive';
}

export interface DelegationAccountDetails extends SmartAccountDetails {
  delegationId: string;
  delegationType: string;
  caveats: DelegationCaveat[];
  delegatedTo: string;
  expiresAt?: Date;
  sessionKey: SessionKey;
  passkey?: PasskeyCredential | null;
  revokedAt?: Date;
}

export interface WalletError {
  code: string;
  message: string;
  timestamp: Date;
  retryable: boolean;
}

// Smart Account Integration Service
export class SmartAccountIntegration {
  private provider: ethers.providers.Web3Provider;
  private smartAccountService: SmartAccountService;
  
  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.smartAccountService = createSmartAccountService(provider);
  }
  
  /**
   * Create a new smart account
   */
  async createSmartAccount(ownerAddress: Address, name: string): Promise<SmartAccountDetails> {
    try {
      // Generate a random salt for the smart account
      const salt = ethers.utils.hexlify(ethers.utils.randomBytes(32));
      
      // Create the smart account
      const smartAccountAddress = await this.smartAccountService.createSmartAccount({
        owner: ownerAddress,
        salt
      });
      
      // Get the balance of the smart account
      const balance = await this.provider.getBalance(smartAccountAddress);
      
      // Return the smart account details
      return {
        id: `sa-${Date.now()}`,
        address: smartAccountAddress,
        name,
        type: 'Smart',
        balance: parseFloat(ethers.utils.formatEther(balance)),
        createdAt: new Date(),
        status: 'Active'
      };
    } catch (error) {
      console.error('Error creating smart account:', error);
      throw this._formatError(error, 'SA_CREATE_ERROR', 'Failed to create smart account');
    }
  }
  
  /**
   * Get all smart accounts for a user
   */
  async getSmartAccounts(ownerAddress: Address): Promise<SmartAccountDetails[]> {
    try {
      // Get all smart accounts for the owner
      const smartAccountAddresses = await this.smartAccountService.getSmartAccounts(ownerAddress);
      
      // Get details for each smart account
      const smartAccounts: SmartAccountDetails[] = [];
      
      for (let i = 0; i < smartAccountAddresses.length; i++) {
        const address = smartAccountAddresses[i];
        const balance = await this.provider.getBalance(address);
        
        smartAccounts.push({
          id: `sa-${i}`,
          address,
          name: `Smart Account ${i + 1}`,
          type: 'Smart',
          balance: parseFloat(ethers.utils.formatEther(balance)),
          createdAt: new Date(), // We don't have the creation date from the contract
          status: 'Active'
        });
      }
      
      return smartAccounts;
    } catch (error) {
      console.error('Error getting smart accounts:', error);
      throw this._formatError(error, 'SA_GET_ERROR', 'Failed to get smart accounts');
    }
  }
  
  /**
   * Create a delegation from a smart account
   */
  async createDelegation(
    smartAccountAddress: string,
    delegateAddress: Address,
    caveats: DelegationCaveat[],
    sessionKey: SessionKey
  ): Promise<DelegationAccountDetails> {
    try {
      // Convert caveats to the format expected by the contract
      const contractCaveats = caveats.map(caveat => {
        return {
          caveatType: this._getCaveatTypeHash(caveat.type),
          terms: this._encodeCaveatTerms(caveat)
        };
      });
      
      // Calculate expiration time (default to 30 days)
      const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
      
      // Create the delegation
      const delegationId = await this.smartAccountService.createDelegation(
        smartAccountAddress,
        {
          delegator: smartAccountAddress as Address,
          delegate: delegateAddress,
          expiresAt,
          caveats: contractCaveats
        }
      );
      
      // Get the balance of the smart account
      const balance = await this.provider.getBalance(smartAccountAddress);
      
      // Return the delegation account details
      return {
        id: `da-${Date.now()}`,
        address: smartAccountAddress,
        name: 'Delegated Account',
        type: 'Delegate',
        balance: parseFloat(ethers.utils.formatEther(balance)),
        createdAt: new Date(),
        status: 'Active',
        delegationId,
        delegationType: 'EXECUTE',
        caveats,
        delegatedTo: delegateAddress,
        expiresAt: new Date(expiresAt * 1000),
        sessionKey
      };
    } catch (error) {
      console.error('Error creating delegation:', error);
      throw this._formatError(error, 'DELEGATION_CREATE_ERROR', 'Failed to create delegation');
    }
  }
  
  /**
   * Revoke a delegation
   */
  async revokeDelegation(
    smartAccountAddress: string,
    delegationId: string
  ): Promise<boolean> {
    try {
      return await this.smartAccountService.revokeDelegation(
        smartAccountAddress,
        delegationId
      );
    } catch (error) {
      console.error('Error revoking delegation:', error);
      throw this._formatError(error, 'DELEGATION_REVOKE_ERROR', 'Failed to revoke delegation');
    }
  }
  
  /**
   * Create a session key
   */
  async createSessionKey(
    smartAccountAddress: string,
    publicKey: string,
    expiresInDays: number = 30
  ): Promise<SessionKey> {
    try {
      const expiresAt = Math.floor(Date.now() / 1000) + (expiresInDays * 24 * 60 * 60);
      
      const sessionKeyId = await this.smartAccountService.createSessionKey(
        smartAccountAddress,
        {
          owner: smartAccountAddress as Address,
          publicKey,
          expiresAt
        }
      );
      
      // In a real implementation, the private key would be generated securely
      // and never exposed to the server
      const privateKey = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      return {
        id: sessionKeyId,
        publicKey,
        privateKey,
        createdAt: new Date(),
        expiresAt: new Date(expiresAt * 1000)
      };
    } catch (error) {
      console.error('Error creating session key:', error);
      throw this._formatError(error, 'SESSION_KEY_CREATE_ERROR', 'Failed to create session key');
    }
  }
  
  /**
   * Register a passkey
   */
  async registerPasskey(
    smartAccountAddress: string,
    passkey: PasskeyCredential
  ): Promise<string> {
    try {
      return await this.smartAccountService.registerPasskey(
        smartAccountAddress,
        {
          owner: smartAccountAddress as Address,
          publicKey: passkey.id, // Using id as publicKey since PasskeyCredential doesn't have publicKey
          credentialId: passkey.id
        }
      );
    } catch (error) {
      console.error('Error registering passkey:', error);
      throw this._formatError(error, 'PASSKEY_REGISTER_ERROR', 'Failed to register passkey');
    }
  }
  
  /**
   * Execute a transaction from a smart account
   */
  async executeTransaction(
    smartAccountAddress: string,
    target: Address,
    value: string,
    data: string,
    options?: {
      delegationId?: string;
      sessionKeyId?: string;
      signature?: string;
    }
  ): Promise<string> {
    try {
      return await this.smartAccountService.execute(
        smartAccountAddress,
        {
          target,
          value,
          data,
          delegationId: options?.delegationId,
          sessionKeyId: options?.sessionKeyId,
          signature: options?.signature
        }
      );
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw this._formatError(error, 'TRANSACTION_ERROR', 'Failed to execute transaction');
    }
  }
  
  /**
   * Get delegation status
   */
  getDelegationStatus(delegationAccount: DelegationAccountDetails): DelegationStatus {
    if (delegationAccount.revokedAt) {
      return DelegationStatus.Revoked;
    }
    
    if (delegationAccount.expiresAt && delegationAccount.expiresAt < new Date()) {
      return DelegationStatus.Expired;
    }
    
    return DelegationStatus.Active;
  }
  
  /**
   * Format error for consistent error handling
   */
  private _formatError(error: any, code: string, defaultMessage: string): WalletError {
    return {
      code,
      message: error.message || defaultMessage,
      timestamp: new Date(),
      retryable: code !== 'DELEGATION_REVOKE_ERROR'
    };
  }
  
  /**
   * Get caveat type hash
   */
  private _getCaveatTypeHash(type: string): string {
    const typeStr = type as string;
    switch (typeStr) {
      case 'nativeTokenTransferAmount':
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes('nativeTokenTransferAmount'));
      case 'timeLimit':
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes('timeLimit'));
      case 'allowlistedMethods':
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes('allowlistedMethods'));
      case 'maxUses':
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes('maxUses'));
      default:
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(typeStr));
    }
  }
  
  /**
   * Encode caveat terms
   */
  private _encodeCaveatTerms(caveat: DelegationCaveat): string {
    const typeStr = caveat.type as string;
    switch (typeStr) {
      case 'nativeTokenTransferAmount':
        return ethers.utils.defaultAbiCoder.encode(['uint256'], [ethers.utils.parseEther(caveat.value.toString())]);
      case 'timeLimit':
        const timestamp = Math.floor(Date.now() / 1000) + (parseInt(caveat.value.toString()) * 3600); // Convert hours to timestamp
        return ethers.utils.defaultAbiCoder.encode(['uint256'], [timestamp]);
      case 'allowlistedMethods':
        return ethers.utils.defaultAbiCoder.encode(['bytes4[]'], [caveat.value]);
      case 'maxUses':
        return ethers.utils.defaultAbiCoder.encode(['uint256'], [caveat.value]);
      default:
        return ethers.utils.defaultAbiCoder.encode(['string'], [caveat.value.toString()]);
    }
  }
}

// Export a function to create the integration
export function createSmartAccountIntegration(provider: ethers.providers.Web3Provider): SmartAccountIntegration {
  return new SmartAccountIntegration(provider);
}
