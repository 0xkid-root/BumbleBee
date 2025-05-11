"use client"

import { useState, useEffect } from "react"
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
import { type Asset, useWalletStore } from "@/lib/store/use-wallet-store"
import { useTransactionStore } from "@/lib/store/use-transaction-store"
import { Loader2, AlertCircle, ArrowDownUp, Settings } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"

type SwapAssetsModalProps = {
  isOpen: boolean
  onClose: () => void
  fromAsset: Asset | null
}

export function SwapAssetsModal({ isOpen, onClose, fromAsset }: SwapAssetsModalProps) {
  const { assets, isConnected } = useWalletStore()
  const { addTransaction } = useTransactionStore()
  const { toast } = useToast()

  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [toAssetId, setToAssetId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slippage, setSlippage] = useState(0.5) // 0.5%
  const [showSettings, setShowSettings] = useState(false)

  const availableAssets = assets || []

  // Set initial to asset (different from from asset)
  useEffect(() => {
    if (fromAsset && availableAssets.length > 0) {
      const otherAsset = availableAssets.find((asset) => asset.id !== fromAsset.id)
      if (otherAsset) {
        setToAssetId(otherAsset.id)
      } else if (availableAssets.length > 0) {
        setToAssetId(availableAssets[0].id)
      }
    }
  }, [fromAsset, availableAssets])

  const toAsset = availableAssets.find((asset) => asset.id === toAssetId) || null

  // Calculate exchange rate and update to amount when from amount changes
  useEffect(() => {
    if (fromAsset && toAsset && fromAmount) {
      const fromValue = Number.parseFloat(fromAmount) * fromAsset.price
      const toTokens = fromValue / toAsset.price
      setToAmount(toTokens.toFixed(6))
    }
  }, [fromAmount, fromAsset, toAsset])

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
  }

  const handleToAmountChange = (value: string) => {
    setToAmount(value)

    if (fromAsset && toAsset && value) {
      const toValue = Number.parseFloat(value) * toAsset.price
      const fromTokens = toValue / fromAsset.price
      setFromAmount(fromTokens.toFixed(6))
    }
  }

  const handleMaxAmount = () => {
    if (fromAsset) {
      setFromAmount(fromAsset.amount.toString())
    }
  }

  const handleSwapDirection = () => {
    if (fromAsset && toAsset) {
      setToAssetId(fromAsset.id)
      onClose() // Close and reopen with new from asset
      setTimeout(() => {
        // This is a workaround since we can't directly change the fromAsset prop
        // In a real app, you'd use a more robust state management approach
      }, 100)
    }
  }

  const handleSwap = async () => {
    if (!fromAsset || !toAsset) return

    // Validate inputs
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (Number.parseFloat(fromAmount) > fromAsset.amount) {
      setError("Insufficient balance")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add transaction to store
      const txId = addTransaction({
        type: "swap",
        status: "pending",
        hash: "0x" + Math.random().toString(16).slice(2),
        from: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t", // User's address
        to: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t", // Same address for swaps
        amount: fromAmount,
        asset: fromAsset.symbol,
        fee: (0.002).toString(),
        fromAsset: fromAsset.symbol,
        toAsset: toAsset.symbol,
        fromAmount: fromAmount,
        toAmount: toAmount,
      })

      toast({
        title: "Swap submitted",
        description: `Swapping ${fromAmount} ${fromAsset.symbol} to ${toAmount} ${toAsset.symbol}`,
      })

      // Simulate transaction confirmation after some time
      setTimeout(() => {
        const success = Math.random() > 0.2 // 80% success rate for demo

        if (success) {
          useTransactionStore.getState().updateTransactionStatus(txId, "completed", 12345678)
          toast({
            title: "Swap completed",
            description: `Successfully swapped ${fromAmount} ${fromAsset.symbol} to ${toAmount} ${toAsset.symbol}`,
            variant: "default",
          })
        } else {
          useTransactionStore.getState().updateTransactionStatus(txId, "failed")
          toast({
            title: "Swap failed",
            description: "Please try again later",
            variant: "destructive",
          })
        }
      }, 5000)

      onClose()
      setFromAmount("")
      setToAmount("")
    } catch (err) {
      setError("Failed to execute swap. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFromAmount("")
    setToAmount("")
    setError(null)
    setShowSettings(false)
    onClose()
  }

  // Calculate price impact
  const priceImpact =
    fromAmount && Number.parseFloat(fromAmount) > 0 ? Math.min(Number.parseFloat(fromAmount) * 0.01, 5) : 0

  // Calculate minimum received with slippage
  const minimumReceived =
    toAmount && Number.parseFloat(toAmount) > 0 ? Number.parseFloat(toAmount) * (1 - slippage / 100) : 0

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Swap Assets</span>
            <Popover open={showSettings} onOpenChange={setShowSettings}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Transaction Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="slippage">Slippage Tolerance</Label>
                      <span className="text-sm">{slippage}%</span>
                    </div>
                    <Slider
                      id="slippage"
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={[slippage]}
                      onValueChange={(value) => setSlippage(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.1%</span>
                      <span>5%</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </DialogTitle>
          <DialogDescription>Swap between your assets at the best available rates</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* From Asset */}
          <div className="grid gap-2">
            <Label>From</Label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 p-3 bg-muted rounded-lg">
                <div className="relative h-6 w-6 rounded-full overflow-hidden">
                  <Image
                    src={fromAsset?.logo || "/placeholder.svg"}
                    alt={fromAsset?.name || "Asset"}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{fromAsset?.symbol}</span>
              </div>

              <div className="flex-[2] relative">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                  onClick={handleMaxAmount}
                >
                  MAX
                </Button>
              </div>
            </div>
            {fromAsset && (
              <div className="text-xs text-muted-foreground">
                Balance: {fromAsset.amount} {fromAsset.symbol}
              </div>
            )}
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted" onClick={handleSwapDirection}>
              <ArrowDownUp className="h-4 w-4" />
              <span className="sr-only">Swap direction</span>
            </Button>
          </div>

          {/* To Asset */}
          <div className="grid gap-2">
            <Label>To</Label>
            <div className="flex gap-2">
              <Select value={toAssetId || ""} onValueChange={setToAssetId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets
                    .filter((asset) => asset.id !== fromAsset?.id)
                    .map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        <div className="flex items-center gap-2">
                          <div className="relative h-5 w-5 rounded-full overflow-hidden">
                            <Image
                              src={asset.logo || "/placeholder.svg"}
                              alt={asset.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>{asset.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-[2]"
              />
            </div>
            {toAsset && (
              <div className="text-xs text-muted-foreground">
                Balance: {toAsset.amount} {toAsset.symbol}
              </div>
            )}
          </div>

          {/* Exchange Rate */}
          {fromAsset && toAsset && fromAmount && Number.parseFloat(fromAmount) > 0 && (
            <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span>
                  1 {fromAsset.symbol} = {(fromAsset.price / toAsset.price).toFixed(6)} {toAsset.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price Impact</span>
                <span className={priceImpact > 3 ? "text-amber-500" : "text-green-500"}>{priceImpact.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Minimum Received</span>
                <span>
                  {minimumReceived.toFixed(6)} {toAsset.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Network Fee</span>
                <span>~0.002 ETH</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSwap}
            disabled={isLoading || !fromAmount || !toAmount || Number.parseFloat(fromAmount) <= 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Swapping...
              </>
            ) : (
              "Swap"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
