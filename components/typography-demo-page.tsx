"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TypographyDemo } from "@/components/ui/typography"
import { ColorDemo } from "@/components/ui/color-palette"
import { ModeToggle } from "@/components/mode-toggle"

export default function TypographyDemoPage() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bumblebee Design System</h1>
        <ModeToggle />
      </div>

      <Tabs defaultValue="typography" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>

        <TabsContent value="typography" className="space-y-8">
          <div className="prose prose-amber max-w-none">
            <h2>Typography System</h2>
            <p>
              Our typography system is designed to create clear visual hierarchy and improve readability across all
              devices. We use <strong>Inter</strong> as our body font for excellent readability and{" "}
              <strong>Montserrat</strong> for headings to add personality.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <TypographyDemo />
          </div>

          <div className="prose prose-amber max-w-none">
            <h3>Usage Guidelines</h3>
            <ul>
              <li>Use headings (H1-H6) to establish clear hierarchy</li>
              <li>Limit use of gradient text to important headings and CTAs</li>
              <li>Maintain sufficient contrast between text and background</li>
              <li>Use the Lead component for introductory paragraphs</li>
              <li>Use Muted and Subtle components for secondary information</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-8">
          <div className="prose prose-amber max-w-none">
            <h2>Color System</h2>
            <p>
              Our color system is built around a primary amber/gold palette that represents the Bumblebee brand,
              complemented by teal and purple accents. The system is designed to be accessible and work well in both
              light and dark modes.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <ColorDemo />
          </div>

          <div className="prose prose-amber max-w-none">
            <h3>Usage Guidelines</h3>
            <ul>
              <li>Use primary colors for main actions, navigation, and branding</li>
              <li>Use secondary colors for supporting elements and alternative actions</li>
              <li>Use accent colors sparingly to highlight important information</li>
              <li>Ensure sufficient contrast for text and interactive elements</li>
              <li>Use semantic colors consistently to communicate meaning</li>
              <li>Test color combinations in both light and dark modes</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
