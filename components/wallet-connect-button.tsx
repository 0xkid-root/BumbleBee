"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"

const walletOptions = [
  {
    name: "MetaMask",
    icon: "/placeholder.svg?height=40&width=40&query=metamask logo",
  },
  {
    name: "WalletConnect",
    icon: "/placeholder.svg?height=40&width=40&query=walletconnect logo",
  },
  {
    name: "XDC Pay",
    icon: "/placeholder.svg?height=40&width=40&query=xdc pay logo",
  },
]

export default function WalletConnectButton({ size = "default", className = "" }) {
  const [open, setOpen] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(null)

  const handleConnect = (wallet) => {
    setSelectedWallet(wallet)
    setConnecting(true)

    // Simulate connection process
    setTimeout(() => {
      setConnecting(false)
      setOpen(false)
      // Here you would actually connect to the wallet
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={size} className={`bg-primary text-primary-foreground hover:bg-primary/90 group ${className}`}>
          Connect Wallet
          <Wallet className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>Choose a wallet to connect to Bumblebee</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {walletOptions.map((wallet, index) => (
            <motion.button
              key={wallet.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleConnect(wallet.name)}
              disabled={connecting}
              className={`flex items-center p-4 rounded-lg border-2 hover:border-primary transition-colors ${
                selectedWallet === wallet.name ? "border-primary bg-primary/10" : ""
              }`}
            >
              <div className="w-10 h-10 mr-4 relative">
                <img
                  src={wallet.icon || "/placeholder.svg"}
                  alt={`${wallet.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{wallet.name}</h3>
                <p className="text-sm text-muted-foreground">Connect using {wallet.name}</p>
              </div>
              {connecting && selectedWallet === wallet.name && (
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full ml-2"></div>
              )}
            </motion.button>
          ))}
        </div>
        <div className="text-xs text-center text-muted-foreground mt-2">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  )
}
