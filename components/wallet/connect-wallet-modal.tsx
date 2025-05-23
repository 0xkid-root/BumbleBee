"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWalletStore } from "@/lib/store/use-wallet-store"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

type ConnectWalletModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConnect?: () => Promise<void>
}

const walletOptions = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "/ethereum-logo.png",
    description: "Connect to your MetaMask wallet",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "/walletconnect-logo.png",
    description: "Scan with WalletConnect to connect",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "/coinbase-logo.png",
    description: "Connect to your Coinbase wallet",
  },
]

export function ConnectWalletModal({ isOpen, onOpenChange, onConnect }: ConnectWalletModalProps) {
  const { connectWallet, isConnecting: storeIsConnecting, connectionError, clearConnectionError } = useWalletStore()
  const { connectWallet: authConnectWallet, isLoading: authIsConnecting } = useAuth()
  
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Combine connection states from both hooks
  const isConnecting = storeIsConnecting || authIsConnecting
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setConnectionState('idle')
      setSelectedWallet(null)
      setErrorMessage(null)
    }
  }, [isOpen])
  
  // Handle connection errors
  useEffect(() => {
    if (connectionError) {
      setConnectionState('error')
      setErrorMessage(connectionError)
    }
  }, [connectionError])
  
  const handleConnect = async (walletId: string, walletName: string) => {
    try {
      setSelectedWallet(walletId)
      setConnectionState('connecting')
      setErrorMessage(null)
      
      // Check if MetaMask is installed when selecting MetaMask
      if (walletId === 'metamask' && typeof window !== 'undefined') {
        if (!window.ethereum) {
          setConnectionState('error')
          setErrorMessage('MetaMask is not installed. Please install MetaMask and try again.')
          toast.error('MetaMask not detected', {
            description: 'Please install the MetaMask extension and refresh the page.'
          })
          return
        }
      }
      
      console.log(`Connecting to ${walletName}...`)
      
      // Use the auth hook's connectWallet function which has improved error handling
      await authConnectWallet()
      
      // If we get here, connection was successful
      setConnectionState('success')
      toast.success('Wallet connected', {
        description: `Successfully connected to ${walletName}`
      })
      
      // Wait a moment to show success state before closing
      setTimeout(() => {
        if (onConnect) {
          onConnect()
        }
        onOpenChange(false)
      }, 1000)
      
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setConnectionState('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect wallet')
      toast.error('Connection failed', {
        description: error instanceof Error ? error.message : 'Failed to connect wallet'
      })
    }
  }
  
  const handleClose = () => {
    clearConnectionError()
    setSelectedWallet(null)
    setConnectionState('idle')
    setErrorMessage(null)
    onOpenChange(false)
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { opacity: 0, scale: 0.95 }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">Connect your wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet to connect to the Bumblebee DeFi platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-6">
            <AnimatePresence mode="wait">
              {connectionState === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center py-6"
                >
                  <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Successfully Connected!</h3>
                  <p className="text-center text-muted-foreground">
                    Your wallet has been connected successfully. Redirecting you...
                  </p>
                </motion.div>
              ) : (
                <>
                  {walletOptions.map((wallet) => (
                    <motion.button
                      key={wallet.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleConnect(wallet.id, wallet.name)}
                      disabled={isConnecting}
                      className={`flex items-center p-4 rounded-lg border-2 hover:border-primary transition-colors ${
                        selectedWallet === wallet.id ? "border-primary bg-primary/10" : "border-border"
                      }`}
                    >
                      <div className="w-10 h-10 mr-4 relative">
                        <Image
                          src={wallet.icon || "/placeholder.svg"}
                          alt={`${wallet.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium">{wallet.name}</h3>
                        <p className="text-sm text-muted-foreground">{wallet.description}</p>
                      </div>
                      {connectionState === 'connecting' && selectedWallet === wallet.id && (
                        <Loader2 className="animate-spin h-5 w-5 ml-2" />
                      )}
                    </motion.button>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {connectionState === 'error' && errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-destructive/10 text-destructive p-4 rounded-md text-sm flex items-start mb-4"
              >
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Connection Error</p>
                  <p>{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="text-xs text-center text-muted-foreground mt-2">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
