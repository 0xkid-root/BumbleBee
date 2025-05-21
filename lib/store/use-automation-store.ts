import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TriggerType = "price_threshold" | "time_based" | "portfolio_change" | "market_event"

export type ActionType = "buy" | "sell" | "swap" | "alert" | "rebalance"

export type Strategy = {
  id: string
  name: string
  description: string
  isActive: boolean
  trigger: {
    type: TriggerType
    conditions: Record<string, any>
  }
  action: {
    type: ActionType
    parameters: Record<string, any>
  }
  createdAt: number
  lastTriggered: number | null
  executionCount: number
  performance?: {
    profitLoss: number
    successRate: number
  }
}

export type StrategyTemplate = {
  id: string
  name: string
  description: string
  category: "beginner" | "intermediate" | "advanced"
  trigger: {
    type: TriggerType
    defaultConditions: Record<string, any>
  }
  action: {
    type: ActionType
    defaultParameters: Record<string, any>
  }
}

type AutomationState = {
  strategies: Strategy[]
  templates: StrategyTemplate[]
  isLoading: boolean
  error: string | null
  executionHistory: {
    id: string
    strategyId: string
    timestamp: number
    success: boolean
    details: string
    result?: Record<string, any>
  }[]
}

type AutomationActions = {
  fetchStrategies: () => Promise<void>
  fetchTemplates: () => Promise<void>
  createStrategy: (strategy: Omit<Strategy, "id" | "createdAt" | "lastTriggered" | "executionCount">) => Promise<string>
  updateStrategy: (id: string, updates: Partial<Omit<Strategy, "id" | "createdAt">>) => Promise<void>
  deleteStrategy: (id: string) => Promise<void>
  toggleStrategyActive: (id: string) => Promise<void>
  simulateStrategy: (strategy: Strategy) => Promise<{
    success: boolean
    projectedOutcome: Record<string, any>
  }>
}

// Mock data for demonstration
const mockStrategies: Strategy[] = [
  {
    id: "1",
    name: "ETH Price Alert",
    description: "Get notified when ETH price crosses $2,500",
    isActive: true,
    trigger: {
      type: "price_threshold",
      conditions: {
        asset: "ETH",
        operator: ">",
        price: 2500,
      },
    },
    action: {
      type: "alert",
      parameters: {
        message: "ETH price has crossed $2,500!",
        channels: ["app", "email"],
      },
    },
    createdAt: Date.now() - 604800000, // 1 week ago
    lastTriggered: Date.now() - 86400000, // 1 day ago
    executionCount: 3,
  },
  {
    id: "2",
    name: "Weekly DCA into BTC",
    description: "Automatically buy $50 of BTC every Monday",
    isActive: true,
    trigger: {
      type: "time_based",
      conditions: {
        frequency: "weekly",
        day: "monday",
        time: "09:00",
      },
    },
    action: {
      type: "buy",
      parameters: {
        asset: "BTC",
        amount: 50,
        currency: "USD",
        source: "USDC",
      },
    },
    createdAt: Date.now() - 2592000000, // 30 days ago
    lastTriggered: Date.now() - 604800000, // 1 week ago
    executionCount: 4,
    performance: {
      profitLoss: 5.2,
      successRate: 100,
    },
  },
  {
    id: "3",
    name: "Portfolio Rebalance",
    description: "Rebalance portfolio when allocation drifts by more than 5%",
    isActive: false,
    trigger: {
      type: "portfolio_change",
      conditions: {
        threshold: 5, // percentage
        checkFrequency: "daily",
      },
    },
    action: {
      type: "rebalance",
      parameters: {
        targetAllocation: {
          ETH: 40,
          USDC: 30,
          USDT: 20,
          BMBL: 10,
        },
      },
    },
    createdAt: Date.now() - 1209600000, // 14 days ago
    lastTriggered: null,
    executionCount: 0,
  },
]

const mockTemplates: StrategyTemplate[] = [
  {
    id: "1",
    name: "Price Alert",
    description: "Get notified when an asset reaches a specific price",
    category: "beginner",
    trigger: {
      type: "price_threshold",
      defaultConditions: {
        asset: "ETH",
        operator: ">",
        price: 2000,
      },
    },
    action: {
      type: "alert",
      defaultParameters: {
        message: "Price target reached!",
        channels: ["app"],
      },
    },
  },
  {
    id: "2",
    name: "Dollar-Cost Averaging",
    description: "Automatically buy a fixed amount of an asset at regular intervals",
    category: "beginner",
    trigger: {
      type: "time_based",
      defaultConditions: {
        frequency: "weekly",
        day: "monday",
        time: "09:00",
      },
    },
    action: {
      type: "buy",
      defaultParameters: {
        asset: "ETH",
        amount: 50,
        currency: "USD",
        source: "USDC",
      },
    },
  },
  {
    id: "3",
    name: "Portfolio Rebalancing",
    description: "Automatically rebalance your portfolio to maintain target allocations",
    category: "intermediate",
    trigger: {
      type: "portfolio_change",
      defaultConditions: {
        threshold: 5,
        checkFrequency: "daily",
      },
    },
    action: {
      type: "rebalance",
      defaultParameters: {
        targetAllocation: {
          ETH: 40,
          USDC: 30,
          USDT: 20,
          BMBL: 10,
        },
      },
    },
  },
  {
    id: "4",
    name: "Market Volatility Response",
    description: "Take action when market volatility exceeds a threshold",
    category: "advanced",
    trigger: {
      type: "market_event",
      defaultConditions: {
        metric: "volatility",
        threshold: 20,
        timeframe: "24h",
      },
    },
    action: {
      type: "sell",
      defaultParameters: {
        asset: "ETH",
        amount: "10%",
        destination: "USDC",
      },
    },
  },
]

const mockExecutionHistory = [
  {
    id: "1",
    strategyId: "1",
    timestamp: Date.now() - 86400000, // 1 day ago
    success: true,
    details: "ETH price crossed $2,500. Alert sent.",
  },
  {
    id: "2",
    strategyId: "1",
    timestamp: Date.now() - 172800000, // 2 days ago
    success: true,
    details: "ETH price crossed $2,500. Alert sent.",
  },
  {
    id: "3",
    strategyId: "1",
    timestamp: Date.now() - 259200000, // 3 days ago
    success: true,
    details: "ETH price crossed $2,500. Alert sent.",
  },
  {
    id: "4",
    strategyId: "2",
    timestamp: Date.now() - 604800000, // 1 week ago
    success: true,
    details: "Purchased $50 of BTC.",
    result: {
      asset: "BTC",
      quantity: 0.0021,
      price: 23809.52,
      fee: 0.5,
    },
  },
  {
    id: "5",
    strategyId: "2",
    timestamp: Date.now() - 1209600000, // 2 weeks ago
    success: true,
    details: "Purchased $50 of BTC.",
    result: {
      asset: "BTC",
      quantity: 0.0022,
      price: 22727.27,
      fee: 0.5,
    },
  },
]

export const useAutomationStore = create<AutomationState & AutomationActions>()(
  persist(
    (set, get) => ({
      strategies: mockStrategies,
      templates: mockTemplates,
      isLoading: false,
      error: null,
      executionHistory: mockExecutionHistory,

      fetchStrategies: async () => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))
          set({ isLoading: false })
        } catch (error) {
          set({ error: "Failed to fetch strategies", isLoading: false })
        }
      },

      fetchTemplates: async () => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))
          set({ isLoading: false })
        } catch (error) {
          set({ error: "Failed to fetch templates", isLoading: false })
        }
      },

      createStrategy: async (strategy) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500))

          const id = Math.random().toString(36).substring(2, 9)
          const newStrategy: Strategy = {
            ...strategy,
            id,
            createdAt: Date.now(),
            lastTriggered: null,
            executionCount: 0,
          }

          set((state) => ({
            strategies: [...state.strategies, newStrategy],
            isLoading: false,
          }))

          return id
        } catch (error) {
          set({ error: "Failed to create strategy", isLoading: false })
          return ""
        }
      },

      updateStrategy: async (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            strategies: state.strategies.map((strategy) =>
              strategy.id === id ? { ...strategy, ...updates } : strategy,
            ),
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to update strategy", isLoading: false })
        }
      },

      deleteStrategy: async (id) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            strategies: state.strategies.filter((strategy) => strategy.id !== id),
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to delete strategy", isLoading: false })
        }
      },

      toggleStrategyActive: async (id) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            strategies: state.strategies.map((strategy) =>
              strategy.id === id ? { ...strategy, isActive: !strategy.isActive } : strategy,
            ),
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to toggle strategy", isLoading: false })
        }
      },

      simulateStrategy: async (strategy) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 2000))

          set({ isLoading: false })

          // Mock simulation result
          return {
            success: true,
            projectedOutcome: {
              executionFrequency: "~4 times per month",
              estimatedAnnualCost: "$24",
              potentialBenefit: "Reduced emotional trading, consistent investing",
            },
          }
        } catch (error) {
          set({ error: "Simulation failed", isLoading: false })
          return {
            success: false,
            projectedOutcome: {},
          }
        }
      },
    }),
    {
      name: "automation-storage",
    },
  ),
)
