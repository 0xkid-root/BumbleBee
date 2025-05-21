import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import TransactionsClient from "./transactions-client"
import { SectionTitle } from "@/components/ui/typography"

export const metadata = {
  title: "Transactions | Bumblebee Finance",
  description: "View and manage your transaction history",
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsClient />
    </Suspense>
  )
}

function TransactionsSkeleton() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionTitle
        title="Transactions"
        subtitle="View and manage your transaction history"
        className="text-left"
        titleClassName="text-3xl"
        subtitleClassName="text-base max-w-none text-left"
      />

      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>

        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    </div>
  )
}
