import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { toast } from "sonner"

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
}

interface SidebarContextValue {
  isCollapsed: boolean
  isMobile: boolean
  isLoading: boolean
  isDarkMode: boolean
  toggleSidebar: () => void
  toggleDarkMode: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ 
  children, 
  defaultCollapsed = false 
}: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Initialize state from localStorage
  useEffect(() => {
    try {
      // Load sidebar state
      const savedState = localStorage.getItem("sidebarState")
      if (savedState) {
        setIsCollapsed(JSON.parse(savedState))
      }

      // Load theme state
      const savedTheme = localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(savedTheme ? JSON.parse(savedTheme) : prefersDark)

      setIsLoading(false)
    } catch (error) {
      console.error("Failed to load sidebar preferences:", error)
      setIsLoading(false)
    }
  }, [])

  // Update sidebar width CSS variable
  useEffect(() => {
    const width = isCollapsed ? "64px" : "280px"
    document.documentElement.style.setProperty("--sidebar-width", width)
  }, [isCollapsed])

  // Toggle sidebar state
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => {
      const newState = !prev
      try {
        localStorage.setItem("sidebarState", JSON.stringify(newState))
      } catch (error) {
        console.error("Failed to save sidebar state:", error)
      }
      return newState
    })
  }, [])

  // Toggle theme
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newState = !prev
      try {
        localStorage.setItem("theme", JSON.stringify(newState))
        document.documentElement.classList.toggle("dark", newState)
      } catch (error) {
        console.error("Failed to save theme preference:", error)
      }
      return newState
    })
  }, [])

  return (
    <SidebarContext.Provider 
      value={{
        isCollapsed,
        isMobile,
        isLoading,
        isDarkMode,
        toggleSidebar,
        toggleDarkMode
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}