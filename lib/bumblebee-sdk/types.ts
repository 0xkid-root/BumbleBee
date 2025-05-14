import { EventEmitter } from "events"
import { Address } from "viem"

export enum Network {
  MAINNET = "mainnet",
  SEPOLIA = "sepolia"
}

export enum PermissionType {
  SUBSCRIPTION = "subscription",
  SOCIAL_PAYMENT = "social_payment",
  DELEGATION = "delegation"
}

export interface BumblebeeSdkConfig {
  address: Address
  network: Network
}

export interface TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  logo?: string
}

export interface OpenAIResponse {
  address: Address
  id: string
  result?: unknown
  activities?: unknown[]
}

export interface SubscriptionPermission {
  type: PermissionType
  address: Address
  timestamp: number
}

export interface RetryOptions<T> {
  retries?: number
  delay?: number
  onRetry?: (error: Error, attempt: number) => void | Promise<void>
}

export interface BumblebeeSdkInstance {
  init: () => Promise<void>
  getSupportedTokens: () => Promise<TokenInfo[]>
  getPermissions: () => Promise<SubscriptionPermission[]>
}

export interface BumblebeeSDK {
  create(config: BumblebeeSdkConfig): Promise<BumblebeeSdkInstance>
  Subscription: any
  SocialPaymentTab: any
  AIWallet: any
  Network: typeof Network
  PermissionType: typeof PermissionType
  NotificationType: any
  Errors: Record<string, any>
  eventEmitter: EventEmitter
}