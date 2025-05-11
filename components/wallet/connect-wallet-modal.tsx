"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWalletStore } from "@/lib/store/use-wallet-store"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

type ConnectWalletModalProps = {
  isOpen: boolean
  onClose: () => void
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

export function ConnectWalletModal({ isOpen, onClose, onConnect }: ConnectWalletModalProps) {
  const { connectWallet, isConnecting, connectionError, clearConnectionError } = useWalletStore()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const handleConnect = async (walletName: string) => {
    setSelectedWallet(walletName)
    await connectWallet(walletName)
    if (onConnect) {
      await onConnect()
    }
    onClose()
  }

  const handleClose = () => {
    clearConnectionError()
    setSelectedWallet(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>Choose a wallet to connect to the Bumblebee DeFi platform</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {walletOptions.map((wallet) => (
            <motion.button
              key={wallet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleConnect(wallet.name)}
              disabled={isConnecting}
              className={`flex items-center p-4 rounded-lg border-2 hover:border-primary transition-colors ${
                selectedWallet === wallet.name ? "border-primary bg-primary/10" : "border-border"
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
              {isConnecting && selectedWallet === wallet.name && <Loader2 className="animate-spin h-5 w-5 ml-2" />}
            </motion.button>
          ))}
        </div>

        {connectionError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{connectionError}</div>
        )}

        <div className="text-xs text-center text-muted-foreground mt-2">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  )
}
