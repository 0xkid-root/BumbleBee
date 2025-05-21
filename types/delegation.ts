export enum DelegationStatus {
  None = "none",
  Pending = "pending",
  Active = "active",
  Revoked = "revoked",
  Expired = "expired"
}

export interface DelegationCaveat {
  id: string;
  type: string;
  value: any;
  description: string;
  params?: Record<string, any>;
}

export interface DelegationAccount {
  id: string;
  name: string;
  address: string;
  status: string;
  caveats: DelegationCaveat[];
  createdAt: string;
  expiresAt: string;
}