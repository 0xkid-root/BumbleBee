"use client"

import type * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type SidebarContextType = {
  isCollapsed: boolean
  toggleSidebar: () => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar")
  }
  return context
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCollapsed?: boolean
  children: React.ReactNode
}

export function Sidebar({ defaultCollapsed = false, children, className, ...props }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
      } else {
        // Load saved preference from localStorage for desktop
        const savedCollapsed = localStorage.getItem("sidebarCollapsed")
        if (savedCollapsed !== null) {
          setIsCollapsed(savedCollapsed === "true")
        }
      }
    }

    // Check on initial load
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Save preference to localStorage when changed
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebarCollapsed", isCollapsed.toString())
    }
  }, [isCollapsed, isMobile])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobile }}>
      <div className={cn("flex h-screen overflow-hidden", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidebarInset({ children, className, ...props }: SidebarInsetProps) {
  return (
    <div className={cn("flex flex-1 flex-col overflow-auto", className)} {...props}>
      {children}
    </div>
  )
}
