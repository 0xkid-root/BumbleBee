import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PortfolioAsset = {
  id: string
  name: string
  symbol: string
  allocation: number // Percentage of portfolio
  value: number
  quantity: number
  price: number
  priceChange24h: number
  priceChange7d: number
  priceChange30d: number
  logo: string
}

export type HistoricalData = {
  timestamp: number
  value: number
}

export type PortfolioPerformance = {
  totalReturn: number
  daily: number
  weekly: number
  monthly: number
  yearly: number
}

export type PortfolioRisk = "low" | "medium" | "high"

export type AssetAllocation = {
  id: string
  name: string
  symbol: string
  value: number
  percentage: number
  color: string
  amount: number
}

type PortfolioState = {
  assets: PortfolioAsset[]
  totalValue: number
  historicalData: {
    daily: HistoricalData[]
    weekly: HistoricalData[]
    monthly: HistoricalData[]
    yearly: HistoricalData[]
  }
  performance: PortfolioPerformance
  risk: PortfolioRisk
  isLoading: boolean
  error: string | null
}

type PortfolioActions = {
  fetchPortfolioData: () => Promise<void>
}

// Mock data for demonstration
const mockAssets: PortfolioAsset[] = [
  {
    id: "1",
    name: "Ethereum",
    symbol: "ETH",
    allocation: 40,
    value: 3245.67,
    quantity: 1.45,
    price: 2238.39,
    priceChange24h: 2.5,
    priceChange7d: 5.2,
    priceChange30d: -3.1,
    logo: "/ethereum-logo.png",
  },
  {
    id: "2",
    name: "USD Coin",
    symbol: "USDC",
    allocation: 30,
    value: 2500,
    quantity: 2500,
    price: 1,
    priceChange24h: 0.01,
    priceChange7d: 0.02,
    priceChange30d: 0.05,
    logo: "/usdc-logo.png",
  },
  {
    id: "3",
    name: "Tether",
    symbol: "USDT",
    allocation: 20,
    value: 1800,
    quantity: 1800,
    price: 1,
    priceChange24h: 0,
    priceChange7d: 0.01,
    priceChange30d: 0.03,
    logo: "/usdt-logo.png",
  },
  {
    id: "4",
    name: "BumbleCoin",
    symbol: "BMBL",
    allocation: 10,
    value: 625,
    quantity: 1250,
    price: 0.5,
    priceChange24h: 5.2,
    priceChange7d: 12.5,
    priceChange30d: 25.3,
    logo: "/abstract-crypto-logo.png",
  },
]

const mockHistoricalData = {
  daily: [{ timestamp: 1672531200000, value: 10000 }],
  weekly: [{ timestamp: 1672531200000, value: 10000 }],
  monthly: [{ timestamp: 1672531200000, value: 10000 }],
  yearly: [{ timestamp: 1672531200000, value: 10000 }],
}

const mockPerformance: PortfolioPerformance = {
  totalReturn: 12.5,
  daily: 0.5,
  weekly: 2.1,
  monthly: 7.3,
  yearly: 25.1,
}

const mockRisk: PortfolioRisk = "medium"

const mockTotalValue = 8170.67

// Export this function so it can be used outside the store
export const getAllocation = (assets: PortfolioAsset[]): AssetAllocation[] => {
  // Add a safety check to prevent errors with undefined assets
  if (!assets || assets.length === 0) {
    return []
  }

  const totalPortfolioValue = assets.reduce((sum, asset) => sum + asset.value, 0)
  return assets.map((asset, index) => ({
    id: asset.id,
    name: asset.name,
    symbol: asset.symbol,
    value: asset.value,
    percentage: (asset.value / totalPortfolioValue) * 100,
    color: ["#2563EB", "#059669", "#CA8A04", "#DC2626"][index % 4],
    amount: asset.quantity,
  }))
}

export const usePortfolioStore = create<PortfolioState & PortfolioActions>()(
  persist(
    (set) => ({
      assets: mockAssets,
      totalValue: mockTotalValue,
      historicalData: mockHistoricalData,
      performance: mockPerformance,
      risk: mockRisk,
      isLoading: false,
      error: null,

      fetchPortfolioData: async () => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))
          set({ isLoading: false })
        } catch (error) {
          set({ error: "Failed to fetch portfolio data", isLoading: false })
        }
      },
    }),
    {
      name: "portfolio-storage",
    },
  ),
)

export const usePortfolioStoreSelectors = {
  allocation: (state: PortfolioState) => getAllocation(state.assets),
  historicalData: (state: PortfolioState) => state.historicalData,
  performance: (state: PortfolioState) => state.performance,
  risk: (state: PortfolioState) => state.risk,
  totalValue: (state: PortfolioState) => state.totalValue,
}
