"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AssetAllocation } from "@/lib/store/use-portfolio-store"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type AssetTableProps = {
  assets: AssetAllocation[]
  onBuy: (assetId: string) => void
  onSell: (assetId: string) => void
  className?: string
}

export function AssetTable({ assets, onBuy, onSell, className }: AssetTableProps) {
  // Sort assets by value (highest first)
  const sortedAssets = [...assets].sort((a, b) => b.value - a.value)

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Assets</CardTitle>
            <CardDescription>Details of your portfolio holdings</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Add Asset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Allocation</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: asset.color }}
                        aria-hidden="true"
                      />
                      <Image
                        src={`/${asset.symbol.toLowerCase()}-logo.png`}
                        alt={asset.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {asset.amount} {asset.symbol}
                </TableCell>
                <TableCell className="text-right font-medium">${asset.value.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-2 w-16 bg-muted rounded-full overflow-hidden" aria-hidden="true">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${asset.percentage}%`,
                          backgroundColor: asset.color,
                        }}
                      />
                    </div>
                    <span>{asset.percentage.toFixed(1)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onBuy(asset.id)}>
                        <ArrowDownRight className="h-4 w-4 mr-2" />
                        Buy
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSell(asset.id)}>
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Sell
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
