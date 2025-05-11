"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useWalletStore } from "@/lib/store/use-wallet-store"
import { useState } from "react"

interface ConnectWalletCardProps {
  onConnect?: () => Promise<void>;
}

export function ConnectWalletCard({ onConnect }: ConnectWalletCardProps) {
  const { connectWallet } = useWalletStore()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
      if (onConnect) {
        await onConnect()
      }
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Card className="flex flex-col items-center text-center p-8 max-w-md mx-auto">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Wallet className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
      <p className="text-muted-foreground mb-6">Connect your wallet to view your assets and manage your transactions</p>
      <Button size="lg" onClick={handleConnect} disabled={isConnecting} className="w-full">
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </Card>
  )
}
