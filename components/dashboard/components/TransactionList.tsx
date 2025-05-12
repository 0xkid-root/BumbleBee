"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react"

interface AnimatedTransactionsProps {
  className?: string
  delay?: number
}

const transactions = [
  {
    id: "1",
    type: "receive",
    amount: "+0.25 ETH",
    value: "$450.83",
    from: "Alex Thompson",
    avatar: "/avatars/man-1.png",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "send",
    amount: "-125 USDC",
    value: "$125.00",
    to: "Maria Garcia",
    avatar: "/avatars/woman-2.png",
    time: "Yesterday",
  },
  {
    id: "3",
    type: "swap",
    amount: "ETH → USDC",
    value: "$210.45",
    time: "2 days ago",
  },
]

export function AnimatedTransactions({ className, delay = 0 }: AnimatedTransactionsProps) {
  const typeIcons = {
    receive: <ArrowDownLeft className="h-4 w-4 text-emerald-500" />,
    send: <ArrowUpRight className="h-4 w-4 text-rose-500" />,
    swap: <RefreshCw className="h-4 w-4 text-amber-500" />,
  }

  const typeBadges = {
    receive: (
      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
        Received
      </Badge>
    ),
    send: (
      <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
        Sent
      </Badge>
    ),
    swap: (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
        Swapped
      </Badge>
    ),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: delay + index * 0.1 }}
                className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                {transaction.avatar ? (
                  <Avatar>
                    <AvatarImage
                      src={transaction.avatar || "/placeholder.svg"}
                      alt={transaction.from || transaction.to || ""}
                    />
                    <AvatarFallback>
                      {(transaction.from || transaction.to || "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    {typeIcons[transaction.type as keyof typeof typeIcons]}
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {transaction.from
                        ? `From ${transaction.from}`
                        : transaction.to
                          ? `To ${transaction.to}`
                          : "Asset Swap"}
                    </p>
                    {typeBadges[transaction.type as keyof typeof typeBadges]}
                  </div>
                  <p className="text-sm text-muted-foreground">{transaction.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{transaction.amount}</p>
                  <p className="text-sm text-muted-foreground">{transaction.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
