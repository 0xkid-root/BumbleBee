import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { connectBundler, getEntryPointContract } from '@/lib/delegation/gatorClient'
import type { WalletError } from '@/lib/delegation/smart-account-integration'

export function useWalletConnection() {
  const [isLoading, setIsLoading] = useState(false)
  const [walletError, setWalletError] = useState<WalletError | null>(null)
  const isConnectingRef = useRef(false)
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connectWallet = useCallback(async () => {
    if (isLoading || isConnectingRef.current) return
    isConnectingRef.current = true
    setIsLoading(true)

    try {
      // Implementation...
    } catch (error: any) {
      // Error handling...
    } finally {
      setIsLoading(false)
      isConnectingRef.current = false
    }
  }, [isLoading])

  return {
    isLoading,
    walletError,
    connectWallet
  }
}

