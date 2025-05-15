import { createPublicClient, http, Address, createWalletClient, parseAbi, encodeFunctionData, isAddress, getContract } from 'viem';
import { sepolia, mainnet } from 'viem/chains';

// Import types only to avoid runtime errors
import type { PublicClient, WalletClient } from 'viem';
// Mock OpenAI client for development purposes
interface OpenAIClient {
  createAgent: (config: any) => Promise<{id: string; address: Address}>;
  callAgent: (params: {agentAddress: Address; action: string}) => Promise<{result: any}>;
  getAgentActivity: (params: {agentAddress: Address}) => Promise<{activities: any[]}>;
}

class OpenAI implements OpenAIClient {
  constructor(config?: any) {}
  
  async createAgent(config: any): Promise<{id: string; address: Address}> {
    // Mock implementation
    return {
      id: 'agent-' + Math.random().toString(36).substring(7),
      address: ('0x' + Math.random().toString(36).substring(2, 14)) as Address,
    };
  }
  
  async callAgent(params: {agentAddress: Address; action: string}): Promise<{result: any}> {
    // Mock implementation
    return {
      result: { success: true, data: 'Action executed successfully' }
    };
  }
  
  async getAgentActivity(params: {agentAddress: Address}): Promise<{activities: any[]}> {
    // Mock implementation
    return {
      activities: []
    };
  }
}
// Mock delegation toolkit functions for development
const grantPermissions = async (params: any): Promise<string> => {
  return 'delegation-' + Math.random().toString(36).substring(7);
};

const revokePermissions = async (delegationId: string): Promise<boolean> => {
  return true;
};
import winston from 'winston';
import dotenv from 'dotenv';
import { retry } from 'ts-retry-promise';
import { z } from 'zod';
import EventEmitter from 'events';

// Environment configuration
const getEnvironmentConfig = () => {
  // Default configuration
  const defaultConfig = {
    RPC_URL: 'https://rpc.sepolia.org',
    GAIA_NET_URL: 'https://api.gaianet.ai',
    GAIA_NET_API_KEY: process.env.NEXT_PUBLIC_GAIA_NET_API_KEY || 'default_key',
    DELEGATION_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_DELEGATION_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    LOG_LEVEL: 'info',
    MAINNET_RPC_URL: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo',
  };

  // Environment variable validation schema
  const envSchema = z.object({
    RPC_URL: z.string(),
    GAIA_NET_URL: z.string(),
    GAIA_NET_API_KEY: z.string(),
    DELEGATION_CONTRACT_ADDRESS: z.string(),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    MAINNET_RPC_URL: z.string().optional(),
  }).passthrough();

  try {
    return envSchema.parse(defaultConfig);
  } catch (error) {
    console.error('Environment configuration error:', error);
    throw error;
  }
};

const env = getEnvironmentConfig();

// Logger Configuration
const logger = typeof window === 'undefined' ? winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.errors({ stack: true })
  ),
  transports: [
    new winston.transports.Console(),
  ],
}) : {
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
  log: console.log,
};

// Event Emitter for Notifications
const eventEmitter = new EventEmitter();

// Enums
export enum Network {
  Sepolia = 'sepolia',
  Mainnet = 'mainnet',
}

export enum PermissionType {
  NativeTokenStream = 'native-token-stream',
  Custom = 'custom',
}

export enum NotificationType {
  PaymentSuccess = 'payment_success',
  PaymentFailure = 'payment_failure',
  TabUpdate = 'tab_update',
  AgentAction = 'agent_action',
}

// Interfaces
export interface Permission {
  type: PermissionType;
  params: {
    amount?: string;
    frequency?: string;
    token?: string;
    recipient?: Address;
    target?: Address;
    caveats?: Caveat[];
  };
}

export interface PermissionDetails {
  delegationId: string;
  type: PermissionType;
  params: Permission['params'];
  createdAt: number;
}

export interface Caveat {
  type: string;
  params: any;
}

export interface StreamParams {
  amount: number;
  duration: string;
}

export interface AgentConfig {
  model: string;
  purpose: string;
  nodeUrl?: string;
}

export interface TransactionOptions {
  gasLimit?: bigint;
  paymaster?: Address;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  confirmations?: number;
}

export interface TabState {
  isActive: boolean;
  totalExpenses: bigint;
  participants: Address[];
  contributions: Record<Address, bigint>;
  owner: Address;
}

export interface BumblebeeSdkConfig {
  address: Address;
  network: Network;
}

// Custom Errors
export class BumblebeeError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'BumblebeeError';
    this.code = code;
    Error.captureStackTrace(this, BumblebeeError);
  }
}

export const Errors = {
  WALLET_NOT_CONNECTED: { code: 'WALLET_001', message: 'Wallet not connected' },
  INVALID_PERMISSION: { code: 'PERM_001', message: 'Invalid permission parameters' },
  PERMISSION_NOT_FOUND: { code: 'PERM_002', message: 'Permission not found' },
  AI_AGENT_FAILED: { code: 'AI_001', message: 'AI agent execution failed' },
  INVALID_ADDRESS: { code: 'ADDR_001', message: 'Invalid Ethereum address' },
  CONTRACT_DEPLOYMENT_FAILED: { code: 'CONTRACT_001', message: 'Contract deployment failed' },
  TRANSACTION_FAILED: { code: 'TX_001', message: 'Transaction execution failed' },
  NETWORK_MISMATCH: { code: 'NETWORK_001', message: 'Network mismatch detected' },
  CONFIG_INVALID: { code: 'CONFIG_001', message: 'Invalid configuration' },
  INSUFFICIENT_FUNDS: { code: 'FUNDS_001', message: 'Insufficient funds in Gator Smart Account' },
  INVALID_CAVEAT: { code: 'CAVEAT_001', message: 'Invalid caveat configuration' },
  NODE_UNAVAILABLE: { code: 'NODE_001', message: 'GaiaNet node unavailable' },
};

// SharedTab ABI
const SharedTabABI = parseAbi([
  'constructor(address _delegationContract)',
  'event ExpenseAdded(uint256 indexed amount, string description)',
  'event TabClosed(uint256 indexed finalBalance)',
  'event FundsDistributed(address indexed participant, uint256 amount)',
  'function addParticipant(address participant) returns (bool)',
  'function addExpense(uint256 amount, string description) returns (bool)',
  'function closeTab() returns (bool)',
  'function getDelegation(address participant) view returns (bytes)',
  'function owner() view returns (address)',
  'function isActive() view returns (bool)',
  'function totalExpenses() view returns (uint256)',
  'function getParticipants() view returns (address[])',
  'function contributions(address participant) view returns (uint256)',
  'function distributeFunds() returns (bool)',
]);

// Configuration
const NETWORK_CONFIGS = {
  [Network.Sepolia]: {
    chain: sepolia,
    chainId: '0xaa36a7',
    rpcUrl: env.RPC_URL,
  },
  [Network.Mainnet]: {
    chain: mainnet,
    chainId: '0x1',
    rpcUrl: env.MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
  },
};

// Input validation schemas
const permissionParamsSchema = z.object({
  amount: z.string().optional(),
  frequency: z.string().optional(),
  token: z.string().optional(),
  recipient: z.string().refine(isAddress).optional(),
  target: z.string().refine(isAddress).optional(),
  caveats: z.array(z.object({ type: z.string(), params: z.any() })).optional(),
});

const streamParamsSchema = z.object({
  amount: z.number().positive(),
  duration: z.string().min(1),
});

const caveatSchema = z.array(z.object({ type: z.string().min(1), params: z.any() }));

// Wallet Class
class Wallet {
  private client: any;
  private walletClient: any;
  private account: Address | null = null;
  private network: Network;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  constructor(network: Network = Network.Sepolia) {
    this.network = network;
  }

  async connect(): Promise<Address> {
    if (!window.ethereum) {
      logger.error('MetaMask Flask not installed');
      throw new BumblebeeError('MetaMask Flask is not installed', 'WALLET_002');
    }

    try {
      const config = NETWORK_CONFIGS[this.network];
      this.client = createPublicClient({
        chain: config.chain,
        transport: http(config.rpcUrl, { timeout: 30_000, retryCount: 2 }),
      });

      this.walletClient = createWalletClient({
        chain: config.chain,
        transport: http(undefined, { timeout: 30_000, retryCount: 2 }),
      });

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.account = accounts[0] as Address;

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== config.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: config.chainId }],
          });
        } catch (switchError: any) {
          logger.error(`Network switch failed: ${switchError.message}`);
          throw new BumblebeeError(`Please switch to ${this.network} network`, Errors.NETWORK_MISMATCH.code);
        }
      }

      logger.info(`Connected to account: ${this.account}`, { network: this.network });
      return this.account;
    } catch (error: any) {
      logger.error('Wallet connection failed', { error: error.message });
      throw new BumblebeeError(error.message, 'WALLET_003');
    }
  }

  getClient() {
    if (!this.client) {
      throw new BumblebeeError('Client not initialized', 'WALLET_004');
    }
    return this.client;
  }

  getWalletClient() {
    if (!this.walletClient) {
      throw new BumblebeeError('Wallet client not initialized', 'WALLET_005');
    }
    return this.walletClient;
  }

  getAccount(): Address | null {
    return this.account;
  }

  async estimateGas(tx: any): Promise<bigint> {
    try {
      return await withRetry(
        () => this.client.estimateGas(tx),
        { retries: this.maxRetries, delay: this.retryDelay }
      );
    } catch (error: any) {
      logger.error('Gas estimation failed', { error: error.message });
      throw new BumblebeeError('Gas estimation failed', 'GAS_001');
    }
  }
}

// Utilities
function validatePermissionParams(params: Permission['params']): boolean {
  try {
    permissionParamsSchema.parse(params);
    if (params.amount && params.frequency && params.token) {
      return true;
    }
    throw new Error('Missing required permission parameters');
  } catch (error: any) {
    logger.warn('Invalid permission parameters', { params, error: error.message });
    throw new BumblebeeError(Errors.INVALID_PERMISSION.message, Errors.INVALID_PERMISSION.code);
  }
}

function validateAddress(address: string): boolean {
  if (!isAddress(address)) {
    logger.warn(`Invalid address: ${address}`);
    throw new BumblebeeError(Errors.INVALID_ADDRESS.message, Errors.INVALID_ADDRESS.code);
  }
  return true;
}

interface RetryOptions<T> {
  retries?: number;
  delay?: number;
  onRetry?: (error: Error, attempt: number) => Promise<void> | void;
}

async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions<T> = {}): Promise<T> {
  const { retries = 3, delay = 1000, onRetry } = options;
  try {
    return await retry(fn, {
      retries,
      delay,
      backoff: 'EXPONENTIAL',
    });
  } catch (error: any) {
    logger.warn(`All retry attempts failed: ${error.message}`);
    if (onRetry && error instanceof Error) await onRetry(error, retries);
    throw error;
  }
}

async function checkAccountBalance(client: any, account: Address, token: string, amount: bigint): Promise<boolean> {
  try {
    if (token.toLowerCase() === 'eth') {
      const balance = await client.getBalance({ address: account });
      return balance >= amount;
    } else {
      const tokenContract = getContract({
        address: token as Address,
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        client,
      });
      // Mock implementation to fix TypeScript error
      const balance = await client.readContract({
        address: token as Address,
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [account]
      });
      return balance >= amount;
    }
  } catch (error: any) {
    logger.error('Balance check failed', { error: error.message, account, token });
    throw new BumblebeeError(Errors.INSUFFICIENT_FUNDS.message, Errors.INSUFFICIENT_FUNDS.code);
  }
}

function validateCaveats(caveats: Caveat[]): boolean {
  try {
    caveatSchema.parse(caveats);
    return true;
  } catch (error: any) {
    logger.warn('Invalid caveats', { error: error.message, caveats });
    throw new BumblebeeError(Errors.INVALID_CAVEAT.message, Errors.INVALID_CAVEAT.code);
  }
}

async function checkNodeAvailability(nodeUrl: string): Promise<boolean> {
  try {
    const response = await fetch(nodeUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    return response.ok;
  } catch (error: any) {
    logger.warn('GaiaNet node unavailable', { error: error.message, nodeUrl });
    throw new BumblebeeError(Errors.NODE_UNAVAILABLE.message, Errors.NODE_UNAVAILABLE.code);
  }
}

// Subscription Module
export class Subscription {
  private wallet: Wallet;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
  private permissions: Map<string, PermissionDetails> = new Map();

  constructor(network: Network = Network.Sepolia) {
    this.wallet = new Wallet(network);
  }

  async requestSubscriptionPermission(
    amount: number,
    frequency: string,
    token: string,
    options: TransactionOptions = {}
  ): Promise<string> {
    const account = await this.wallet.connect();
    validatePermissionParams({ amount: amount.toString(), frequency, token });

    const permission: Permission = {
      type: PermissionType.NativeTokenStream,
      params: {
        amount: amount.toString(),
        frequency,
        token,
        recipient: account,
      },
    };

    try {
      const delegationId = await withRetry(
        () =>
          grantPermissions({
            client: this.wallet.getClient(),
            account,
            permissions: [permission],
            paymaster: options.paymaster,
            maxFeePerGas: options.maxFeePerGas,
            maxPriorityFeePerGas: options.maxPriorityFeePerGas,
          }),
        { retries: this.maxRetries, delay: this.retryDelay }
      );

      this.permissions.set(delegationId, {
        delegationId,
        type: permission.type,
        params: permission.params,
        createdAt: Date.now(),
      });

      logger.info(`Subscription permission granted`, { delegationId, account });
      eventEmitter.emit(NotificationType.PaymentSuccess, { delegationId, type: 'subscription_created' });
      return delegationId;
    } catch (error: any) {
      logger.error('Failed to grant subscription permission', { error: error.message });
      eventEmitter.emit(NotificationType.PaymentFailure, { delegationId: 'unknown', error: error.message });
      throw new BumblebeeError(Errors.INVALID_PERMISSION.message, Errors.INVALID_PERMISSION.code);
    }
  }

  async executeSubscriptionPayment(delegationId: string, options: TransactionOptions = {}): Promise<boolean> {
    const account = this.wallet.getAccount();
    if (!account) {
      throw new BumblebeeError(Errors.WALLET_NOT_CONNECTED.message, Errors.WALLET_NOT_CONNECTED.code);
    }

    const permission = this.permissions.get(delegationId);
    if (!permission) {
      throw new BumblebeeError(Errors.PERMISSION_NOT_FOUND.message, Errors.PERMISSION_NOT_FOUND.code);
    }

    try {
      const isSufficient = await checkAccountBalance(
        this.wallet.getClient(),
        account,
        permission.params.token!,
        BigInt(permission.params.amount!)
      );
      if (!isSufficient) {
        eventEmitter.emit(NotificationType.PaymentFailure, { delegationId, error: 'Insufficient funds' });
        throw new BumblebeeError(Errors.INSUFFICIENT_FUNDS.message, Errors.INSUFFICIENT_FUNDS.code);
      }

      // Ensure recipient is not undefined before using it
      if (!permission.params.recipient) {
        throw new BumblebeeError('Recipient address is required', 'PARAM_001');
      }
      
      const txHash = await this.wallet.getWalletClient().sendTransaction({
        account,
        to: permission.params.recipient as `0x${string}`, // Type assertion to fix TypeScript error
        value: permission.params.token!.toLowerCase() === 'eth' ? BigInt(permission.params.amount!) : 0,
        data: permission.params.token!.toLowerCase() !== 'eth' ? encodeFunctionData({
          abi: parseAbi(['function transfer(address to, uint256 amount)']),
          functionName: 'transfer',
          args: [permission.params.recipient, BigInt(permission.params.amount!)],
        }) : undefined,
        gas: options.gasLimit,
        maxFeePerGas: options.maxFeePerGas,
        maxPriorityFeePerGas: options.maxPriorityFeePerGas,
        paymaster: options.paymaster,
      });

      const receipt = await this.wallet.getClient().waitForTransactionReceipt({
        hash: txHash,
        confirmations: options.confirmations || 1,
        timeout: 60_000,
      });

      if (receipt.status === 'success') {
        logger.info(`Payment executed`, { delegationId, txHash });
        eventEmitter.emit(NotificationType.PaymentSuccess, { delegationId, txHash });
        return true;
      } else {
        throw new Error('Transaction reverted');
      }
    } catch (error: any) {
      logger.error('Payment execution failed', { error: error.message, delegationId });
      eventEmitter.emit(NotificationType.PaymentFailure, { delegationId, error: error.message });
      throw new BumblebeeError(Errors.TRANSACTION_FAILED.message, Errors.TRANSACTION_FAILED.code);
    }
  }

  async cancelSubscription(delegationId: string): Promise<boolean> {
    const account = this.wallet.getAccount();
    if (!account) {
      throw new BumblebeeError(Errors.WALLET_NOT_CONNECTED.message, Errors.WALLET_NOT_CONNECTED.code);
    }

    if (!this.permissions.has(delegationId)) {
      throw new BumblebeeError(Errors.PERMISSION_NOT_FOUND.message, Errors.PERMISSION_NOT_FOUND.code);
    }

    try {
      await withRetry(
        () => revokePermissions( delegationId ),
        { retries: this.maxRetries, delay: this.retryDelay }
      );

      this.permissions.delete(delegationId);
      logger.info(`Subscription cancelled`, { delegationId });
      eventEmitter.emit(NotificationType.PaymentSuccess, { delegationId, type: 'subscription_cancelled' });
      return true;
    } catch (error: any) {
      logger.error('Subscription cancellation failed', { error: error.message, delegationId });
      eventEmitter.emit(NotificationType.PaymentFailure, { delegationId, error: error.message });
      throw new BumblebeeError(Errors.TRANSACTION_FAILED.message, Errors.TRANSACTION_FAILED.code);
    }
  }

  getPermissionDetails(delegationId: string): PermissionDetails | null {
    const permission = this.permissions.get(delegationId);
    if (!permission) {
      logger.warn('Permission not found', { delegationId });
      return null;
    }
    return permission;
  }
}

// Social Payment Tabs Module
export class SocialPaymentTab {
  private contract!: Contract // Using the definite assignment assertion (!) to tell TypeScript that this will be initialized

  // Use a static async factory method instead of an async constructor
  static async create(address: Address, sdk: BumblebeeSDK): Promise<SocialPaymentTab> {
    const instance = new SocialPaymentTab();
    instance.contract = await sdk.getContract(address);
    return instance;
  }
  
  // Private constructor for use with factory method
  private constructor() {}
  

  async getBalance(): Promise<bigint> {
    return this.contract.read<bigint>('balanceOf', [])
  }

  async addParticipant(participant: Address): Promise<`0x${string}`> {
    return this.contract.write('addParticipant', [participant])
  }

  async addExpense(amount: bigint, description: string): Promise<`0x${string}`> {
    return this.contract.write('addExpense', [amount, description])
  }

  async closeTab(): Promise<`0x${string}`> {
    return this.contract.write('closeTab', [])
  }
}

// AI Wallet Module
export class AIWallet {
  private wallet: Wallet;
  private client: OpenAI;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
  private permissions: Map<string, PermissionDetails> = new Map();

  constructor(network: Network = Network.Sepolia) {
    this.wallet = new Wallet(network);
    this.client = new OpenAI({
      baseURL: env.GAIA_NET_URL,
      apiKey: env.GAIA_NET_API_KEY,
      timeout: 30_000,
    });
  }

  async deployAgent(agentConfig: AgentConfig): Promise<{ agentAddress: Address; agentId: string }> {
    const account = this.wallet.getAccount();
    if (!account) {
      throw new BumblebeeError(Errors.WALLET_NOT_CONNECTED.message, Errors.WALLET_NOT_CONNECTED.code);
    }

    try {
      // Validate node availability if specified
      if (agentConfig.nodeUrl) {
        await checkNodeAvailability(agentConfig.nodeUrl);
      }

      // Placeholder for actual OpenAI client response
      const response = await withRetry<{id: string; address: Address}>(
        () =>
          this.client.createAgent({
            model: agentConfig.model,
            purpose: agentConfig.purpose,
            owner: account,
            nodeUrl: agentConfig.nodeUrl,
          }),
        { retries: this.maxRetries, delay: this.retryDelay }
      );

      if (!response.address || !response.id) {
        throw new Error('Invalid response from OpenAI');
      }

      const result = {
        agentAddress: response.address as Address,
        agentId: response.id,
      };

      logger.info(`AI agent deployed`, { agentAddress: result.agentAddress, agentId: result.agentId });
      return result;
    } catch (error: any) {
      logger.error('AI agent deployment failed', { error: error.message });
      throw new BumblebeeError(Errors.AI_AGENT_FAILED.message, Errors.AI_AGENT_FAILED.code);
    }
  }

  async setupAIDelegation(agentAddress: Address, caveats: Caveat[], options: TransactionOptions = {}): Promise<string> {
    const account = await this.wallet.connect();
    validateAddress(agentAddress);
    validateCaveats(caveats);

    const permissions: Permission[] = [{
      type: PermissionType.Custom,
      params: { target: agentAddress, caveats },
    }];

    try {
      const delegationId = await withRetry(
        () =>
          grantPermissions({
            client: this.wallet.getClient(),
            account,
            permissions,
            paymaster: options.paymaster,
            maxFeePerGas: options.maxFeePerGas,
            maxPriorityFeePerGas: options.maxFeePerGas,
          }),
        { retries: this.maxRetries, delay: this.retryDelay }
      );

      this.permissions.set(delegationId, {
        delegationId,
        type: PermissionType.Custom,
        params: { target: agentAddress, caveats },
        createdAt: Date.now(),
      });

      logger.info(`AI delegation set up`, { agentAddress, delegationId });
      eventEmitter.emit(NotificationType.AgentAction, {
        agentAddress,
        event: 'delegation_setup',
        delegationId,
      });
      return delegationId;
    } catch (error: any) {
      logger.error('AI delegation setup failed', { error: error.message, agentAddress });
      throw new BumblebeeError(Errors.INVALID_PERMISSION.message, Errors.INVALID_PERMISSION.code);
    }
  }

  async executeAIAgentAction(agentAddress: Address, action: string, options: TransactionOptions = {}): Promise<any> {
    const account = this.wallet.getAccount();
    if (!account) {
      throw new BumblebeeError(Errors.WALLET_NOT_CONNECTED.message, Errors.WALLET_NOT_CONNECTED.code);
    }

    validateAddress(agentAddress);
    try {
      const response = await withRetry(
        () => this.client.callAgent({ agentAddress, action }),
        { retries: this.maxRetries, delay: this.retryDelay }
      );

      logger.info(`AI action executed`, { agentAddress, action });
      eventEmitter.emit(NotificationType.AgentAction, {
        agentAddress,
        event: 'action_executed',
        action,
        result: response.result,
      });
      return response.result;
    } catch (error: any) {
      logger.error('AI action execution failed', { error: error.message, agentAddress });
      throw new BumblebeeError(Errors.AI_AGENT_FAILED.message, Errors.AI_AGENT_FAILED.code);
    }
  }

  async revokeAIDelegation(delegationId: string): Promise<boolean> {
    const account = this.wallet.getAccount();
    if (!account) {
      throw new BumblebeeError(Errors.WALLET_NOT_CONNECTED.message, Errors.WALLET_NOT_CONNECTED.code);
    }

    if (!this.permissions.has(delegationId)) {
      throw new BumblebeeError(Errors.PERMISSION_NOT_FOUND.message, Errors.PERMISSION_NOT_FOUND.code);
    }

    try {
      await withRetry(
        () => revokePermissions(delegationId ),
        { retries: this.maxRetries, delay: this.retryDelay }
      );

      this.permissions.delete(delegationId);
      logger.info(`AI delegation revoked`, { delegationId });
      eventEmitter.emit(NotificationType.AgentAction, {
        delegationId,
        event: 'delegation_revoked',
      });
      return true;
    } catch (error: any) {
      logger.error('AI delegation revocation failed', { error: error.message, delegationId });
      throw new BumblebeeError(Errors.TRANSACTION_FAILED.message, Errors.TRANSACTION_FAILED.code);
    }
  }

  async getAgentActivity(agentAddress: Address): Promise<any[]> {
    validateAddress(agentAddress);
    try {
      const response = await withRetry(
        () => this.client.getAgentActivity({ agentAddress }),
        { retries: this.maxRetries, delay: this.retryDelay }
      );

      logger.info(`Fetched agent activity`, { agentAddress });
      return response.activities || [];
    } catch (error: any) {
      logger.error('Failed to fetch agent activity', { error: error.message, agentAddress });
      throw new BumblebeeError(Errors.AI_AGENT_FAILED.message, Errors.AI_AGENT_FAILED.code);
    }
  }
}

// SDK Class
export class BumblebeeSDK {
  private static validateConfig(config: BumblebeeSdkConfig): void {
    if (!config.address || !isAddress(config.address)) {
      throw new Error('Invalid wallet address')
    }
    
    if (!config.network) {
      throw new Error('Network is required')
    }
  }

  static async create(config: BumblebeeSdkConfig): Promise<BumblebeeSDK> {
    if (!config.address || !isAddress(config.address)) {
      throw new Error('Invalid wallet address')
    }

    const sdk = new BumblebeeSDK({
      ...config,
      gaiaNetApiKey: env.GAIA_NET_API_KEY,
      delegationContract: env.DELEGATION_CONTRACT_ADDRESS,
    })

    if (!env.GAIA_NET_API_KEY) {
      console.warn('GAIA_NET_API_KEY not provided, some features may be limited')
    }

    if (!env.DELEGATION_CONTRACT_ADDRESS) {
      console.warn('DELEGATION_CONTRACT_ADDRESS not provided, delegation features will be disabled')
    }

    await sdk.init()
    return sdk
  }

  private client: PublicClient;
  private contracts: Map<string, Contract> = new Map();
  private wallet: any; // Add wallet property to fix TypeScript error
  private rpcUrl: string;

  private constructor(private config: BumblebeeSdkConfig) {
    this.rpcUrl = config.network === Network.Mainnet 
      ? (env.MAINNET_RPC_URL || env.RPC_URL)
      : env.RPC_URL
  }
  private client: PublicClient
  private contracts: Map<string, Contract> = new Map()
  private wallet: any // Add wallet property to fix TypeScript error

  
  // Add init method to fix TypeScript error in subscription management component
  async init(): Promise<void> {
    // Initialize SDK components
    this.wallet = {
      getClient: () => ({ /* mock wallet client */ })
    };
  }

  // Initialize SDK components
  async init(): Promise<void> {
    // Any async initialization can go here
    return Promise.resolve();
  }
  
  // Add getSubscription method to fix TypeScript error in subscription management component
  getSubscription() {
    return {
      requestSubscriptionPermission: async (
        amount: number,
        frequency: string,
        token: string,
        options: any = {}
      ): Promise<string> => {
        // Mock implementation for development
        console.log(`Requesting subscription permission: ${amount} ${token} every ${frequency}`);
        return `delegation-${Math.random().toString(36).substring(7)}`;
      },
      cancelSubscription: async (delegationId: string): Promise<boolean> => {
        // Mock implementation for development
        console.log(`Cancelling subscription: ${delegationId}`);
        return true;
      }
    };
  }

  protected createContract(address: Address, abi: any[]): Contract {
    const contract = new Contract({
      address,
      abi,
      client: this.client,
      wallet: this.wallet
    })
    this.contracts.set(address, contract)
    return contract
  }

  async getContract(address: Address): Promise<Contract> {
    const existing = this.contracts.get(address)
    if (existing) return existing

    const contract = this.createContract(address, [])
    return contract
  }
}

// Factory Function
export const createSDK = async (address: Address, chainId: number): Promise<BumblebeeSDK> => {
  const sdkConfig: BumblebeeSdkConfig = {
    address,
    network: chainId === 1 ? Network.Mainnet : Network.Sepolia,
  };

  return BumblebeeSDK.create(sdkConfig);
};

// Export event emitter for external use
export { eventEmitter };

// These imports are already defined at the top of the file

interface ContractConfig {
  address: Address
  abi: readonly any[]
  client: any // Using any temporarily to resolve the PublicClient error
  wallet?: any // Using any temporarily to resolve the WalletClient error
}

class Contract {
  private config: ContractConfig

  constructor(config: ContractConfig) {
    this.config = config
  }

  async read<T>(
    functionName: string,
    args: readonly unknown[] = []
  ): Promise<T> {
    return this.config.client.readContract({
      address: this.config.address,
      abi: this.config.abi,
      functionName: functionName as any,
      args
    }) as Promise<T>
  }

  async write(
    functionName: string,
    args: readonly unknown[] = []
  ): Promise<`0x${string}`> {
    if (!this.config.wallet) {
      throw new Error('Wallet not connected')
    }

    return this.config.wallet.writeContract({
      address: this.config.address,
      abi: this.config.abi, 
      functionName: functionName as any,
      args
    })
  }
}

// The withRetry function is already defined above, so we don't need to redefine it here