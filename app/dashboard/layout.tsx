import type React from "react"
import type { Metadata } from "next"
import  DashboardLayout  from "@/components/dashboard/dashboard-layout"

export const metadata: Metadata = {
  title: "Dashboard | Bumblebee",
  description: "Bumblebee DeFi Dashboard",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
