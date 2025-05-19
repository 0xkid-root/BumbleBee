import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Transaction = {
  id: string
  type: "send" | "receive" | "swap" | "stake" | "unstake"
  assetSymbol: string
  amount: number
  value: number
  timestamp: number
  status: "pending" | "completed" | "confirmed" | "failed"
  from: string
  to: string
  fee: number
  hash: string
}

type TransactionState = {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  filters: {
    type: string | null
    status: string | null
    dateRange: [Date | null, Date | null]
    assetSymbol: string | null
  }
}

type TransactionActions = {
  fetchTransactions: () => Promise<void>
  addTransaction: (transaction: Partial<Transaction> & Pick<Transaction, "type" | "assetSymbol" | "amount" | "value" | "from" | "to" | "status" | "fee">) => Promise<string>
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>
  setFilters: (filters: Partial<TransactionState["filters"]>) => void
  clearFilters: () => void
  getFilteredTransactions: () => Transaction[]
}

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "send",
    assetSymbol: "ETH",
    amount: 0.5,
    value: 1119.2,
    timestamp: Date.now() - 3600000, // 1 hour ago
    status: "completed",
    from: "0x1a2b...9s0t",
    to: "0x9s8r...2b1a",
    fee: 0.002,
    hash: "0xabcd...1234",
  },
  {
    id: "2",
    type: "receive",
    assetSymbol: "USDC",
    amount: 500,
    value: 500,
    timestamp: Date.now() - 86400000, // 1 day ago
    status: "completed",
    from: "0x9s8r...2b1a",
    to: "0x1a2b...9s0t",
    fee: 0,
    hash: "0xefgh...5678",
  },
  {
    id: "3",
    type: "swap",
    assetSymbol: "ETH → USDC",
    amount: 0.2,
    value: 447.68,
    timestamp: Date.now() - 172800000, // 2 days ago
    status: "completed",
    from: "0x1a2b...9s0t",
    to: "0x1a2b...9s0t",
    fee: 0.001,
    hash: "0xijkl...9012",
  },
  {
    id: "4",
    type: "stake",
    assetSymbol: "BMBL",
    amount: 100,
    value: 50,
    timestamp: Date.now() - 604800000, // 1 week ago
    status: "completed",
    from: "0x1a2b...9s0t",
    to: "Staking Contract",
    fee: 0.0005,
    hash: "0xmnop...3456",
  },
  {
    id: "5",
    type: "send",
    assetSymbol: "USDT",
    amount: 200,
    value: 200,
    timestamp: Date.now() - 1209600000, // 2 weeks ago
    status: "failed",
    from: "0x1a2b...9s0t",
    to: "0x5t4s...6r7q",
    fee: 0,
    hash: "0xqrst...7890",
  },
]

export const useTransactionStore = create<TransactionState & TransactionActions>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      isLoading: false,
      error: null,
      filters: {
        type: null,
        status: null,
        dateRange: [null, null],
        assetSymbol: null,
      },

      fetchTransactions: async () => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))
          set({ isLoading: false })
        } catch (error) {
          set({ error: "Failed to fetch transactions", isLoading: false })
        }
      },

      addTransaction: async (transaction) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // If transaction has an ID, it's an update to an existing transaction
          const id = transaction.id || Math.random().toString(36).substring(2, 9);
          const timestamp = transaction.timestamp || Date.now();
          const hash = transaction.hash || `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`;

          const newTransaction: Transaction = {
            ...transaction,
            id,
            timestamp,
            hash,
          } as Transaction;

          // If it's an update, replace the existing transaction
          if (transaction.id) {
            set((state) => ({
              transactions: state.transactions.map(tx => 
                tx.id === transaction.id ? newTransaction : tx
              ),
              isLoading: false,
            }));
          } else {
            // Otherwise add as a new transaction
            set((state) => ({
              transactions: [newTransaction, ...state.transactions],
              isLoading: false,
            }));
          }

          return id;
        } catch (error) {
          set({ error: "Failed to add transaction", isLoading: false })
          return "";
        }
      },

      updateTransaction: async (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            transactions: state.transactions.map(tx => 
              tx.id === id ? { ...tx, ...updates } : tx
            ),
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to update transaction", isLoading: false })
        }
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
        }))
      },

      clearFilters: () => {
        set({
          filters: {
            type: null,
            status: null,
            dateRange: [null, null],
            assetSymbol: null,
          },
        })
      },

      getFilteredTransactions: () => {
        const { transactions, filters } = get()

        return transactions.filter((tx) => {
          // Filter by type
          if (filters.type && tx.type !== filters.type) {
            return false
          }

          // Filter by status
          if (filters.status && tx.status !== filters.status) {
            return false
          }

          // Filter by date range
          const [startDate, endDate] = filters.dateRange
          if (startDate && tx.timestamp < startDate.getTime()) {
            return false
          }
          if (endDate) {
            // Add one day to include the end date fully
            const endOfDay = new Date(endDate)
            endOfDay.setDate(endOfDay.getDate() + 1)
            if (tx.timestamp > endOfDay.getTime()) {
              return false
            }
          }

          // Filter by asset
          if (filters.assetSymbol && !tx.assetSymbol.includes(filters.assetSymbol)) {
            return false
          }

          return true
        })
      },
    }),
    {
      name: "transaction-storage",
    },
  ),
)
