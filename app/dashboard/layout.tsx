import { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export const metadata: Metadata = {
  title: "Dashboard | Bumblebee",
  description: "Manage your digital assets and social payments"
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
