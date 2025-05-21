export interface AuthUser {
  id: string
  name: string | null
  address: string
  createdAt: number
}

export interface AuthHookResult {
  user: AuthUser | null
  isLoading: boolean
  isConnected: boolean
  address: `0x${string}` | undefined
  chainId: number | undefined
  showRegistration: boolean
  registerUser: (userData: { name: string }) => Promise<void>
  disconnect: () => void
  connectWallet: (args?: { connector?: any }) => Promise<void>
  setShowRegistration: (show: boolean) => void
}