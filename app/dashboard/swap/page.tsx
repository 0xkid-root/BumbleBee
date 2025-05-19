import { Suspense } from "react"
import TokenSwap from "./token-swap"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Subscriptions | Bumblebee Finance",
  description: "Manage your recurring payments and subscriptions with ERC-7715 support",
}


export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<TokenSwapSkeleton />}>   
      <div className="container mx-auto py-6">
        <TokenSwap />
      </div>
    </Suspense>
  )
}

function TokenSwapSkeleton() {
  return (
    
    <div className="flex-1 space-y-8 p-8 pt-6">
    
      <div className="space-y-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[180px] rounded-xl" />
        <Skeleton className="h-[180px] rounded-xl" />
        <Skeleton className="h-[180px] rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
