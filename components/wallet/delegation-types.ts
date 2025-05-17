/**
 * Types for delegation functionality in the BumbleBee wallet
 */

import { Address } from "viem";

// Delegation status enum
export enum DelegationStatus {
  None = "None",
  Pending = "Pending",
  Active = "Active",
  Revoked = "Revoked",
  Expired = "Expired",
  Failed = "Failed"
}

// Permission types for delegation
export enum PermissionType {
  Full = "Full",
  ReadOnly = "ReadOnly",
  Custom = "Custom",
  None = "None"
}

// Caveat types for delegation
export enum CaveatType {
  MaxAmount = "MaxAmount",
  TimeLimit = "TimeLimit",
  WhitelistedAddresses = "WhitelistedAddresses",
  BlacklistedAddresses = "BlacklistedAddresses",
  MaxTransactionsPerDay = "MaxTransactionsPerDay",
  RequireConfirmation = "RequireConfirmation"
}

// Interface for delegation caveats
export interface DelegationCaveat {
  id: string;
  type: CaveatType;
  value: any;
  description: string;
}

// Interface for delegation account
export interface DelegationAccount {
  id: string;
  address: Address;
  name: string;
  type: 'Delegate';
  balance: number;
  createdAt: Date;
  status: DelegationStatus | 'Active' | 'Pending' | 'Revoked';
  delegationId: string;
  delegationType: PermissionType;
  caveats: DelegationCaveat[];
  delegatedTo: string;
}

// Interface for smart account
export interface SmartAccount {
  id: string;
  address: Address;
  name: string;
  type: 'Smart';
  balance: number;
  createdAt: Date;
  status: 'Active' | 'Pending' | 'Inactive';
}

// Interface for delegation request
export interface DelegationRequest {
  id: string;
  delegator: Address;
  delegate: Address;
  permissions: PermissionType;
  caveats: DelegationCaveat[];
  status: DelegationStatus;
  createdAt: Date;
  expiresAt?: Date;
}

// Interface for delegation options
export interface DelegationOptions {
  permissions: PermissionType;
  caveats: DelegationCaveat[];
  delegateName: string;
  delegateAddress?: Address;
}
