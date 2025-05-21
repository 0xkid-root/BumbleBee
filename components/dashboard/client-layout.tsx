"use client"

import { lazy, Suspense, useState, useCallback, useMemo } from "react"
import { SidebarProvider } from "@/components/providers/sidebar-provider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

const DashboardSidebar = lazy(() => 
  import("./sidebar").then(mod => ({ default: mod.DashboardSidebar }))
)

interface ClientDashboardLayoutProps {
  children: React.ReactNode
}

export function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  // Initialize sidebar state from localStorage or default to expanded (false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Only run in client-side during initialization
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarState");
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (error) {
          console.error("Error parsing sidebar state:", error);
        }
      }
    }
    return false; // Default to expanded
  });
  
  // Memoized setIsCollapsed function that also updates localStorage
  const handleSetIsCollapsed = useCallback((value: boolean | ((prevState: boolean) => boolean)) => {
    setIsCollapsed((prevState: boolean) => {
      // Calculate the new state
      const newState = typeof value === 'function' ? value(prevState) : value;
      
      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebarState", JSON.stringify(newState));
      }
      
      return newState;
    });
  }, []);

  // Memoize the main content style to prevent unnecessary re-renders
  const mainContentStyle = useMemo(() => ({ 
    marginLeft: isCollapsed ? '70px' : '280px' 
  }), [isCollapsed]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Suspense fallback={<SidebarSkeleton collapsed={isCollapsed} />}>
          <DashboardSidebar 
            isCollapsed={isCollapsed} 
            setIsCollapsed={handleSetIsCollapsed} 
          />
        </Suspense>
        <main 
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
            "px-4 md:px-8 py-6 md:py-8"
          )}
          style={mainContentStyle}
        >
          <div className="max-w-7xl mx-auto space-y-8">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

function SidebarSkeleton({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div 
      className="h-screen border-r bg-muted/10 animate-pulse fixed left-0 top-0" 
      style={{ width: collapsed ? '70px' : '280px' }}
    />
  )
}