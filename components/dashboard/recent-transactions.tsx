"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Clock, ChevronRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { AnimatedList } from "@/components/ui/animated-list"

type Transaction = {
  id: string
  type: "send" | "receive" | "swap"
  status: "completed" | "pending" | "failed"
  amount: string
  asset: string
  date: string
  recipient?: string
  sender?: string
  fromAsset?: string
  toAsset?: string
}

const transactions: Transaction[] = [
  {
    id: "tx1",
    type: "send",
    status: "completed",
    amount: "0.5 ETH",
    asset: "ETH",
    date: "Today, 10:45 AM",
    recipient: "0x1a2...3b4c",
  },
  {
    id: "tx2",
    type: "receive",
    status: "completed",
    amount: "250 USDC",
    asset: "USDC",
    date: "Yesterday, 3:30 PM",
    sender: "0x5d6...7e8f",
  },
  {
    id: "tx3",
    type: "swap",
    status: "completed",
    amount: "1.2 ETH → 2,100 USDC",
    asset: "ETH/USDC",
    date: "May 9, 2023, 2:15 PM",
    fromAsset: "ETH",
    toAsset: "USDC",
  },
  {
    id: "tx4",
    type: "send",
    status: "pending",
    amount: "0.1 ETH",
    asset: "ETH",
    date: "Today, 11:20 AM",
    recipient: "0x9g8...7h6j",
  },
  {
    id: "tx5",
    type: "receive",
    status: "failed",
    amount: "100 USDT",
    asset: "USDT",
    date: "May 8, 2023, 9:45 AM",
    sender: "0x5k4...3l2m",
  },
]

export function RecentTransactions() {
  const [visibleTransactions, setVisibleTransactions] = useState(3)

  const loadMore = () => {
    setVisibleTransactions(Math.min(visibleTransactions + 3, transactions.length))
  }

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "receive":
        return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case "swap":
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 font-medium"
          >
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30 font-medium"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30 font-medium"
          >
            Failed
          </Badge>
        )
    }
  }

  const getAssetImage = (asset: string) => {
    const assetMap: Record<string, string> = {
      ETH: "/ethereum-logo.png",
      USDC: "/usdc-logo.png",
      USDT: "/usdt-logo.png",
    }

    return assetMap[asset] || "/abstract-crypto-logo.png"
  }

  const transactionItems = transactions.slice(0, visibleTransactions).map((transaction) => (
    <div
      key={transaction.id}
      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors hover:border-primary/20"
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            transaction.type === "send"
              ? "bg-red-100 dark:bg-red-900/20"
              : transaction.type === "receive"
                ? "bg-green-100 dark:bg-green-900/20"
                : "bg-blue-100 dark:bg-blue-900/20",
          )}
        >
          {getTransactionIcon(transaction.type)}
        </div>
        <div>
          <div className="flex items-center">
            <div className="font-medium">
              {transaction.type === "send"
                ? `Sent to ${transaction.recipient}`
                : transaction.type === "receive"
                  ? `Received from ${transaction.sender}`
                  : `Swapped ${transaction.fromAsset} to ${transaction.toAsset}`}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{transaction.date}</span>
            <span>•</span>
            {getStatusBadge(transaction.status)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div
            className={cn(
              "font-medium",
              transaction.type === "send"
                ? "text-red-600 dark:text-red-400"
                : transaction.type === "receive"
                  ? "text-green-600 dark:text-green-400"
                  : "",
            )}
          >
            {transaction.type === "send" ? "-" : transaction.type === "receive" ? "+" : ""}
            {transaction.amount}
          </div>
          <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground mt-1">
            <Avatar className="h-4 w-4">
              <AvatarImage
                src={getAssetImage(transaction.asset.split("/")[0]) || "/placeholder.svg"}
                alt={transaction.asset}
              />
              <AvatarFallback>{transaction.asset[0]}</AvatarFallback>
            </Avatar>
            <span>{transaction.asset}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-primary-light dark:hover:bg-primary-light/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="col-span-3 lg:col-span-1"
    >
      <Card className="shadow-sm hover:shadow-md transition-all duration-300 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
              <CardDescription>Your latest activity on the blockchain</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
              View All
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatedList items={transactionItems} staggerDelay={0.1} animationType="fadeSlide" />

            {visibleTransactions < transactions.length && (
              <Button
                variant="ghost"
                className="w-full hover:bg-primary-light dark:hover:bg-primary-light/10 text-primary"
                onClick={loadMore}
              >
                Load more
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
