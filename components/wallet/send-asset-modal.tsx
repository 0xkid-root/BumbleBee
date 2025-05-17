"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Asset } from "@/lib/store/use-wallet-store"
import { useTransactionStore } from "@/lib/store/use-transaction-store"
import { Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export type SendAssetModalProps = {
  isOpen: boolean
  onClose: () => void
  asset: Asset | null
}

export function SendAssetModal({ isOpen, onClose, asset }: SendAssetModalProps) {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { addTransaction } = useTransactionStore()
  const { toast } = useToast()

  const handleSend = async () => {
    if (!asset) return

    // Validate inputs
    if (!recipient) {
      setError("Recipient address is required")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (Number.parseFloat(amount) > asset.amount) {
      setError("Insufficient balance")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add transaction to store
      // Create a transaction object
      await addTransaction({
        type: "send",
        status: "pending",
        from: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t", // User's address
        to: recipient,
        amount: parseFloat(amount),
        assetSymbol: asset.symbol,
        value: parseFloat(amount) * asset.price,
        fee: 0.001,
      })

      toast({
        title: "Transaction submitted",
        description: `Sending ${amount} ${asset.symbol} to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      })

      // Simulate transaction confirmation after some time
      setTimeout(async () => {
        const success = Math.random() > 0.2 // 80% success rate for demo

        // In a real app, we would update the transaction status in the store
        // For now, we'll just show a toast
        if (success) {
          toast({
            title: "Transaction confirmed",
            description: `Successfully sent ${amount} ${asset.symbol}`,
            variant: "default",
          })
        } else {
          toast({
            title: "Transaction failed",
            description: "Please try again later",
            variant: "destructive",
          })
        }
      }, 5000)

      onClose()
      setRecipient("")
      setAmount("")
    } catch (err) {
      setError("Failed to send transaction. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRecipient("")
    setAmount("")
    setError(null)
    onClose()
  }

  const handleMaxAmount = () => {
    if (asset) {
      setAmount(asset.amount.toString())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {asset && (
              <div className="relative h-6 w-6 rounded-full overflow-hidden">
                <Image
                  src={asset.logo || "/placeholder.svg"}
                  alt={`${asset.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            Send {asset?.symbol}
          </DialogTitle>
          <DialogDescription>Send {asset?.name} to another wallet address</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount</Label>
              {asset && (
                <div className="text-xs text-muted-foreground">
                  Balance: {asset.amount} {asset.symbol}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button variant="outline" size="sm" onClick={handleMaxAmount} type="button">
                Max
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-muted p-3 rounded-md text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-muted-foreground">Network Fee</span>
              <span>~0.001 ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estimated Confirmation</span>
              <span>~2 minutes</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
