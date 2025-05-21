import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define Asset interface
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  price: number;
  change24h: number;
  logo: string;
}

// Define SmartAccount interface
export interface SmartAccount {
  id: string;
  address: string;
  name: string;
  type: "EOA" | "Smart" | "Delegate";
  balance: number;
  createdAt: Date;
  status: "Active" | "Pending" | "Inactive";
  ownerAddress?: string;
  implementation?: string;
}

// Base state interfaces
interface WalletState {
  assets: Asset[];
  smartAccounts: SmartAccount[];
  isConnected: boolean;
  address: string | null;
  totalBalance: number;
  isLoading: boolean;
  error: string | null;
  isConnecting: boolean;
  connectionError: string | null;
  showConnectModal: boolean;
}

interface WalletActions {
  connectWallet: (walletName?: string) => Promise<void>;
  disconnectWallet: () => void;
  refreshBalances: () => Promise<void>;
  sendAsset: (assetId: string, amount: number, recipient: string) => Promise<boolean>;
  receiveAsset: (assetId: string) => string;
  swapAssets: (fromAssetId: string, toAssetId: string, amount: number) => Promise<boolean>;
  clearConnectionError: () => void;
  setShowConnectModal: (show: boolean) => void;
  addSmartAccount: (account: SmartAccount) => void;
  removeSmartAccount: (accountId: string) => void;
  updateSmartAccountStatus: (accountId: string, status: "Active" | "Pending" | "Inactive") => void;
}

type WalletStore = WalletState & WalletActions;

// Helper for async delays
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock Assets
const mockAssets: readonly Asset[] = Object.freeze([
  {
    id: "1",
    name: "Ethereum",
    symbol: "ETH",
    amount: 1.45,
    value: 3245.67,
    price: 2238.39,
    change24h: 2.5,
    logo: "/ethereum-logo.png",
  },
  {
    id: "2",
    name: "USD Coin",
    symbol: "USDC",
    amount: 2500,
    value: 2500,
    price: 1,
    change24h: 0.01,
    logo: "/usdc-logo.png",
  },
  {
    id: "3",
    name: "Tether",
    symbol: "USDT",
    amount: 1800,
    value: 1800,
    price: 1,
    change24h: 0,
    logo: "/usdt-logo.png",
  },
  {
    id: "4",
    name: "BumbleCoin",
    symbol: "BMBL",
    amount: 1250,
    value: 625,
    price: 0.5,
    change24h: 5.2,
    logo: "/abstract-crypto-logo.png",
  },
]);

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      // Initial state
      assets: [],
      smartAccounts: [],
      isConnected: false,
      address: null,
      totalBalance: 0,
      isLoading: false,
      error: null,
      isConnecting: false,
      connectionError: null,
      showConnectModal: false,

      // Actions
      connectWallet: async (walletName?: string) => {
        try {
          set({
            isLoading: true,
            error: null,
            isConnecting: true,
            connectionError: null,
          });

          await delay(1500); // Simulate async connection

          set({
            isConnected: true,
            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            assets: [...mockAssets],
            isLoading: false,
            isConnecting: false,
          });

          const totalBalance = get().assets.reduce(
            (sum: number, asset: Asset) => sum + asset.value,
            0
          );
          set({ totalBalance });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Unknown error connecting wallet";
          set({
            isLoading: false,
            error: errorMessage,
            isConnecting: false,
            connectionError: errorMessage,
          });
        }
      },

      disconnectWallet: () => {
        set({
          isConnected: false,
          address: null,
          assets: [],
          totalBalance: 0,
        });
      },

      refreshBalances: async () => {
        set({ isLoading: true, error: null });
        try {
          await delay(1000); // Simulate balance fetch
          const updatedAssets = get().assets.map((asset: Asset) => ({
            ...asset,
            value: asset.amount * asset.price,
          }));

          const totalBalance = updatedAssets.reduce(
            (acc: number, asset: Asset) => acc + asset.value,
            0
          );

          set({
            assets: updatedAssets,
            totalBalance,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: "Failed to refresh balances",
            isLoading: false,
          });
        }
      },

      sendAsset: async (assetId: string, amount: number, recipient: string) => {
        set({ isLoading: true, error: null });
        try {
          await delay(1500); // Simulate transaction

          const updatedAssets = get().assets.map((asset: Asset) => {
            if (asset.id === assetId) {
              return {
                ...asset,
                amount: Math.max(asset.amount - amount, 0),
                value: (Math.max(asset.amount - amount, 0)) * asset.price,
              };
            }
            return asset;
          });

          const totalBalance = updatedAssets.reduce(
            (acc: number, asset: Asset) => acc + asset.value,
            0
          );

          set({
            assets: updatedAssets,
            totalBalance,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({
            error: "Transaction failed",
            isLoading: false,
          });
          return false;
        }
      },

      receiveAsset: (assetId: string) => {
        // Returns a dummy transaction hash
        return "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t";
      },

      swapAssets: async (
        fromAssetId: string,
        toAssetId: string,
        amount: number
      ) => {
        set({ isLoading: true, error: null });
        try {
          await delay(2000); // Simulate swap

          const fromAsset = get().assets.find(
            (asset: Asset) => asset.id === fromAssetId
          );
          const toAsset = get().assets.find(
            (asset: Asset) => asset.id === toAssetId
          );

          if (!fromAsset || !toAsset) {
            throw new Error("Asset not found");
          }

          const exchangeRate = fromAsset.price / toAsset.price;
          const receivedAmount = amount * exchangeRate;

          const updatedAssets = get().assets.map((asset: Asset) => {
            if (asset.id === fromAssetId) {
              return {
                ...asset,
                amount: Math.max(asset.amount - amount, 0),
                value: Math.max(asset.amount - amount, 0) * asset.price,
              };
            }
            if (asset.id === toAssetId) {
              return {
                ...asset,
                amount: asset.amount + receivedAmount,
                value: (asset.amount + receivedAmount) * asset.price,
              };
            }
            return asset;
          });

          const totalBalance = updatedAssets.reduce(
            (acc: number, asset: Asset) => acc + asset.value,
            0
          );

          set({
            assets: updatedAssets,
            totalBalance,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({
            error: "Swap failed",
            isLoading: false,
          });
          return false;
        }
      },

      clearConnectionError: () => {
        set({ connectionError: null });
      },

      setShowConnectModal: (show: boolean) => {
        set({ showConnectModal: show });
      },

      // Smart account management
      addSmartAccount: (account: SmartAccount) => {
        set((state) => ({
          smartAccounts: [...state.smartAccounts, account]
        }));
      },

      removeSmartAccount: (accountId: string) => {
        set((state) => ({
          smartAccounts: state.smartAccounts.filter(account => account.id !== accountId)
        }));
      },

      updateSmartAccountStatus: (accountId: string, status: "Active" | "Pending" | "Inactive") => {
        set((state) => ({
          smartAccounts: state.smartAccounts.map(account => 
            account.id === accountId ? { ...account, status } : account
          )
        }));
      },
    }),
    {
      name: "wallet-storage", // Unique key for localStorage
    }
  )
);