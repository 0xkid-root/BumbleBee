import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SectionTitle } from "@/components/ui/typography"

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <SectionTitle
          title="Help & Support"
          subtitle="Get assistance and learn how to use Bumblebee"
          className="text-left"
          titleClassName="text-3xl"
          subtitleClassName="text-base max-w-none text-left"
        />

        <div className="rounded-lg border p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Help & Support Page Content</h3>
          <p className="text-muted-foreground">This is a placeholder for the help and support page content.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
