// Type declarations for modules without TypeScript definitions

declare module '@/lib/delegation/gatorClient' {
  import { Address } from 'viem';
  
  export interface SessionKey {
    id: string;
    publicKey: string;
    privateKey: string;
    createdAt: Date;
    expiresAt?: Date;
  }

  export interface PasskeyCredential {
    id: string;
    publicKey: string;
    type: 'public-key';
  }

  export interface DelegationCaveat {
    id: string;
    type: string;
    value: any;
    description: string;
    params: Record<string, any>;
  }

  export interface Caveat {
    type: string;
    params: Record<string, any>;
  }

  export interface UserOperationParams {
    sender: `0x${string}`;
    target: `0x${string}`;
    value: bigint;
    data?: string;
    sessionKey?: string;
    passkey?: PasskeyCredential;
  }

  export interface DelegationParams {
    delegator: `0x${string}`;
    delegate: `0x${string}`;
    sessionKey?: string;
    passkey?: PasskeyCredential;
  }

  export function connectBundler(address: Address, chainId: number): Promise<boolean>;
  export function getEntryPointContract(chainId: number): Promise<any>;
  export function createSessionKey(address: Address): Promise<SessionKey>;
  export function sendUserOperation(params: UserOperationParams): Promise<string>;
  export function redeemPermissions(params: DelegationParams): Promise<boolean>;
  export function revokeDelegation(params: DelegationParams): Promise<boolean>;
}
