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
import { sendUserOperation } from "@/lib/delegation/gatorClient"
import { useAccount } from "wagmi"
import { parseEther } from "viem"

export type SendAssetModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  asset: Asset | null
}

export function SendAssetModal({ isOpen, onOpenChange, asset }: SendAssetModalProps) {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { addTransaction } = useTransactionStore()
  const { toast } = useToast()
  const { address } = useAccount()

  const handleSend = async () => {
    if (!asset || !address) return

    // Validate inputs
    if (!recipient) {
      setError("Recipient address is required")
      return
    }

    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      setError("Invalid recipient address format")
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
      // Add transaction to store as pending
      const txId = await addTransaction({
        type: "send",
        status: "pending",
        from: address,
        to: recipient as `0x${string}`,
        amount: parseFloat(amount),
        assetSymbol: asset.symbol,
        value: parseFloat(amount) * asset.price,
        fee: 0.001,
      })

      toast({
        title: "Preparing transaction",
        description: `Sending ${amount} ${asset.symbol} to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      })

      // Send the transaction using the bundler
      const result = await sendUserOperation({
        sender: address as `0x${string}`,
        target: recipient as `0x${string}`,
        value: parseEther(amount),
        waitForReceipt: true
      })

      // Update transaction in store with hash
      if (result.transactionHash) {
        await addTransaction({
          id: txId,
          type: "send",
          status: "confirmed",
          from: address,
          to: recipient as `0x${string}`,
          amount: parseFloat(amount),
          assetSymbol: asset.symbol,
          value: parseFloat(amount) * asset.price,
          fee: 0.001,
          hash: result.transactionHash
        })

        toast({
          title: "Transaction confirmed",
          description: `Successfully sent ${amount} ${asset.symbol}`,
          variant: "default",
        })
      }

      onOpenChange(false)
      setRecipient("")
      setAmount("")
    } catch (err: any) {
      console.error("Transaction error:", err)
      setError(err.message || "Failed to send transaction. Please try again.")
      
      toast({
        title: "Transaction failed",
        description: err.message || "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRecipient("")
    setAmount("")
    setError(null)
    onOpenChange(false)
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
