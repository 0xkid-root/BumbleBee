import { useCallback, useEffect, useState } from 'react'
import { useAccount, useConnect, useNetwork, useDisconnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { toast } from 'sonner'

export function useWalletConnection() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  })
  const { disconnect } = useDisconnect()
  const [isInitializing, setIsInitializing] = useState(true)

  const connectWallet = useCallback(async () => {
    try {
      await connect()
      toast.success('Wallet connected successfully')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }, [connect])

  const disconnectWallet = useCallback(() => {
    disconnect()
    toast.info('Wallet disconnected')
  }, [disconnect])

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum === 'undefined') {
        toast.error('MetaMask not detected. Please install MetaMask.')
        setIsInitializing(false)
        return
      }

      if (!isConnected && window.ethereum.isMetaMask) {
        await connectWallet()
      }
      setIsInitializing(false)
    }

    checkConnection()
  }, [isConnected, connectWallet])

  return {
    address,
    isConnected,
    chainId: chain?.id,
    isInitializing,
    connectWallet,
    disconnectWallet
  }
}