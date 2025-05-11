import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Asset = {
  id: string
  name: string
  symbol: string
  amount: number
  value: number
  price: number
  change24h: number
  logo: string
}

type WalletState = {
  assets: Asset[]
  isConnected: boolean
  address: string | null
  totalBalance: number
  isLoading: boolean
  error: string | null
  isConnecting: boolean
  connectionError: string | null
}

type WalletActions = {
  connectWallet: (walletName?: string) => Promise<void>
  disconnectWallet: () => void
  refreshBalances: () => Promise<void>
  sendAsset: (assetId: string, amount: number, recipient: string) => Promise<boolean>
  receiveAsset: (assetId: string) => string
  swapAssets: (fromAssetId: string, toAssetId: string, amount: number) => Promise<boolean>
  clearConnectionError: () => void
}

// Mock data for demonstration
const mockAssets: Asset[] = [
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
]

export const useWalletStore = create<WalletState & WalletActions>()(persist(
  (set, get) => ({
      assets: [],
      isConnected: false,
      address: null,
      totalBalance: 0,
      isLoading: false,
      error: null,
      isConnecting: false,
      connectionError: null,

      connectWallet: async (walletName?: string) => {
        try {
          set({ isLoading: true, error: null, isConnecting: true, connectionError: null })

          // Simulate connection delay
          await new Promise((resolve) => setTimeout(resolve, 1500))

          set({
            isConnected: true,
            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            assets: mockAssets,
            isLoading: false,
            isConnecting: false,
          })

          // Calculate total balance
          const { assets } = get()
          const totalBalance = assets.reduce((sum, asset) => sum + asset.value, 0)
          set({ totalBalance })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message,
            isConnecting: false,
            connectionError: error.message,
          })
        }
      },

      disconnectWallet: () => {
        set({ isConnected: false, address: null })
      },

      refreshBalances: async () => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))
          set({ isLoading: false })
        } catch (error) {
          set({ error: "Failed to refresh balances", isLoading: false })
        }
      },

      sendAsset: async (assetId, amount, recipient) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // Update asset balance
          const assets = get().assets.map((asset) => {
            if (asset.id === assetId) {
              return {
                ...asset,
                amount: asset.amount - amount,
                value: (asset.amount - amount) * asset.price,
              }
            }
            return asset
          })

          set({
            assets,
            totalBalance: assets.reduce((acc, asset) => acc + asset.value, 0),
            isLoading: false,
          })

          return true
        } catch (error) {
          set({ error: "Transaction failed", isLoading: false })
          return false
        }
      },

      receiveAsset: (assetId) => {
        // Return a mock address for receiving
        return "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
      },

      swapAssets: async (fromAssetId, toAssetId, amount) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Get exchange rate (simplified)
          const fromAsset = get().assets.find((a) => a.id === fromAssetId)
          const toAsset = get().assets.find((a) => a.id === toAssetId)

          if (!fromAsset || !toAsset) {
            throw new Error("Asset not found")
          }

          const exchangeRate = fromAsset.price / toAsset.price
          const receivedAmount = amount * exchangeRate

          // Update asset balances
          const assets = get().assets.map((asset) => {
            if (asset.id === fromAssetId) {
              return {
                ...asset,
                amount: asset.amount - amount,
                value: (asset.amount - amount) * asset.price,
              }
            }
            if (asset.id === toAssetId) {
              return {
                ...asset,
                amount: asset.amount + receivedAmount,
                value: (asset.amount + receivedAmount) * asset.price,
              }
            }
            return asset
          })

          set({
            assets,
            totalBalance: assets.reduce((acc, asset) => acc + asset.value, 0),
            isLoading: false,
          })

          return true
        } catch (error) {
          set({ error: "Swap failed", isLoading: false })
          return false
        }
      },
    }),
    {
      name: "wallet-storage",
    },
  ),
)

// Add the missing clearConnectionError method to the store
useWalletStore.setState({
  clearConnectionError: () => useWalletStore.setState({ connectionError: null })
})
