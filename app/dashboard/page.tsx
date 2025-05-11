import type { Metadata } from "next"
import { DashboardClient } from "./dashboard-client"

export const metadata: Metadata = {
  title: "Dashboard | Bumblebee Finance",
  description: "Your crypto dashboard overview",
}

export default function DashboardPage() {
  return <DashboardClient />
}
