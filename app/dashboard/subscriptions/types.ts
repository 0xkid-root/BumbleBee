export interface StreamConfig {
  expiry: number;
  amountPerSecond: string;
  maxAmount: string;
  startTime: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: string;
  numericAmount: number;
  frequency: string;
  nextPayment: string;
  category: string;
  paymentMethod: string;
  status: "active" | "paused" | "expiring" | "shared";
  description?: string;
  contractAddress?: string;
  erc7715?: boolean;
  tokenAddress?: string;
  recipient?: string;
  isAutoRenewing?: boolean;
  color?: string;
  createdAt?: string;
  logo?: string;
  lastPayment?: string;
  totalSpent?: string;
  totalPayments?: number;
  remainingPayments?: number;
  sharedWith?: string[];
  permissionsContext?: any;
  delegationManager?: string;
  streamConfig?: StreamConfig;
}