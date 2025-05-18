import { type Address } from 'viem'

// Define enums (not as type imports)
export enum PermissionType {
  Custom = 'Custom',
  Full = 'Full',
  Limited = 'Limited'
}

export enum CaveatType {
  TimeLimit = 'TimeLimit',
  MaxAmount = 'MaxAmount',
  AssetType = 'AssetType',
  WhitelistedAddresses = 'WhitelistedAddresses'
}

export type Hex = `0x${string}`

export interface PasskeyCredential {
  id: string;
  publicKey: string;
  type: 'public-key';
  rawId?: ArrayBuffer;
}

export interface SessionKey {
  id: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
}

export interface DelegationCaveat {
  id: string;
  type: CaveatType;
  value: any;
  description: string;
}

export interface SmartAccount {
  address: Address;
  chainId: number;
  type: 'EOA' | 'Smart';
  balance: bigint;
}

export interface DelegationAccount extends SmartAccount {
  id: string;
  delegationId: string;
  delegationType: PermissionType;
  caveats: DelegationCaveat[];
  delegatedTo: string;
  expiresAt?: Date;
  sessionKey: SessionKey;
  passkey?: PasskeyCredential;
  revokedAt?: Date;
  name: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
}

export interface UserOperationParams {
  sender: `0x${string}`;
  target: `0x${string}`;
  value: bigint;
  data: string;
  sessionKey?: string;
  passkey?: PasskeyCredential;
}

export interface DelegationParams {
  delegationId: string;
  signature: string;
}