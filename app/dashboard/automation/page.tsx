import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import AutomationClient from "./automation-client"
import { SectionTitle } from "@/components/ui/typography"

export const metadata = {
  title: "Automation | Bumblebee Finance",
  description: "Set up automated strategies and recurring transactions",
}

export default function AutomationPage() {
  return (
    <Suspense fallback={<AutomationSkeleton />}>
      <AutomationClient />
    </Suspense>
  )
}

function AutomationSkeleton() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionTitle
        title="Automation"
        subtitle="Set up automated strategies and recurring transactions"
        className="text-left"
        titleClassName="text-3xl"
        subtitleClassName="text-base max-w-none text-left"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[200px] rounded-lg" />
        <Skeleton className="h-[200px] rounded-lg" />
        <Skeleton className="h-[200px] rounded-lg" />
      </div>

      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  )
}
