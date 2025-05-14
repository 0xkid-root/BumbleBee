import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, Fira_Code } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Provider } from "@/lib/Provider"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/providers/sidebar-provider"

// Define fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Bumblebee: AI-Powered Social Finance dApp",
  description: "Automate payments, split expenses, and optimize your portfolio with AI—all in one dApp.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable} ${firaCode.variable}`}
    >
      <body className={inter.className}>
        <SidebarProvider>
          <Provider initialState={undefined}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </Provider>
        </SidebarProvider>
      </body>
    </html>
  )
}
