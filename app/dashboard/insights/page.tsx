import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import InsightsClient from "./insights-client"
import { SectionTitle } from "@/components/ui/typography"

export const metadata = {
  title: "AI Insights | Bumblebee Finance",
  description: "Get personalized recommendations and market analysis",
}

export default function InsightsPage() {
  return (
    <Suspense fallback={<InsightsSkeleton />}>
      <InsightsClient />
    </Suspense>
  )
}

function InsightsSkeleton() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionTitle
        title="AI Insights"
        subtitle="Get personalized recommendations and market analysis"
        className="text-left"
        titleClassName="text-3xl"
        subtitleClassName="text-base max-w-none text-left"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[200px] rounded-lg" />
        <Skeleton className="h-[200px] rounded-lg" />
      </div>

      <Skeleton className="h-[400px] w-full rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[250px] rounded-lg" />
        <Skeleton className="h-[250px] rounded-lg" />
        <Skeleton className="h-[250px] rounded-lg" />
      </div>
    </div>
  )
}
