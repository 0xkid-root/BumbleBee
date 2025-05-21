import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import WalletPageClient from "./WalletPageClient"

export const metadata = {
  title: "Wallet | Bumblebee Finance",
  description: "Manage your crypto assets and transactions with AI-powered insights",
}

export default function WalletPage() {
  return (
    <Suspense fallback={<WalletSkeleton />}>
       {/* Honeycomb Background Pattern */}
       <div className="absolute inset-0 z-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <pattern id="honeycomb" width="56" height="100" patternUnits="userSpaceOnUse">
            <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" stroke="#3b82f6" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#honeycomb)" />
        </svg>
      </div>
      <WalletPageClient/>
    </Suspense>
  )
}

function WalletSkeleton() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-4 w-2/4" />
      </div>
      
      {/* Hero section skeleton */}
      <Skeleton className="h-[200px] w-full rounded-lg" />
      
      {/* Tabs skeleton */}
      <div className="flex space-x-2 border-b">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[280px] rounded-lg" />
        ))}
      </div>
      
      {/* Activity section skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}