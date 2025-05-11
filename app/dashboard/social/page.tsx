import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import SocialClient from "./social-client"
import { SectionTitle } from "@/components/ui/typography"

export const metadata = {
  title: "Social Payments | Bumblebee Finance",
  description: "Split expenses and manage shared finances with friends",
}

export default function SocialPage() {
  return (
    <Suspense fallback={<SocialSkeleton />}>
      <SocialClient />
    </Suspense>
  )
}

function SocialSkeleton() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionTitle
        title="Social Payments"
        subtitle="Split expenses and manage shared finances with friends"
        className="text-left"
        titleClassName="text-3xl"
        subtitleClassName="text-base max-w-none text-left"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] md:col-span-1 rounded-lg" />
        <Skeleton className="h-[400px] md:col-span-2 rounded-lg" />
      </div>

      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  )
}
