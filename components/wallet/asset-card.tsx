"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Asset } from "@/lib/store/use-wallet-store"
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type AssetCardProps = {
  asset: Asset
  onSend: (asset: Asset) => void
  onReceive: (asset: Asset) => void
  onSwap: (asset: Asset) => void
  className?: string
}

export function AssetCard({ asset, onSend, onReceive, onSwap, className }: AssetCardProps) {
  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-all", className)}>
      <CardContent className="p-0">
        <div className="flex items-center p-4 border-b">
          <div className="relative h-10 w-10 mr-3 rounded-full overflow-hidden">
            <Image src={asset.logo || "/placeholder.svg"} alt={`${asset.name} logo`} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{asset.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSwap(asset)}>Swap</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSend(asset)}>Send</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReceive(asset)}>Receive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-sm text-muted-foreground">{asset.symbol}</div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-sm text-muted-foreground">Value</div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium">
              {asset.amount} {asset.symbol}
            </div>
            <div className="font-medium">${asset.value.toLocaleString()}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground mr-1">Price:</span>
              <span className="font-medium">${asset.price.toLocaleString()}</span>
            </div>
            <div
              className={cn(
                "text-sm font-medium flex items-center",
                asset.change24h >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {asset.change24h >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownLeft className="h-3 w-3 mr-1" />
              )}
              {Math.abs(asset.change24h)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t">
          <Button
            variant="ghost"
            className="rounded-none h-12 hover:bg-primary/5 text-sm"
            onClick={() => onSend(asset)}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button
            variant="ghost"
            className="rounded-none h-12 hover:bg-primary/5 text-sm border-l border-r"
            onClick={() => onReceive(asset)}
          >
            <ArrowDownLeft className="h-4 w-4 mr-2" />
            Receive
          </Button>
          <Button
            variant="ghost"
            className="rounded-none h-12 hover:bg-primary/5 text-sm"
            onClick={() => onSwap(asset)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M16 3h5v5" />
              <path d="M4 20 21 3" />
              <path d="M21 16v5h-5" />
              <path d="M15 15 3 3" />
            </svg>
            Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
