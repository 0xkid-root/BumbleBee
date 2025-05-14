"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SidebarContextValue {
  isCollapsed: boolean
  toggleSidebar: () => void
  isDarkMode: boolean
  toggleDarkMode: () => void
  isMobile: boolean
  pinnedItems: NavItem[]
  togglePinItem: (item: NavItem) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  showSearchResults: boolean
  setShowSearchResults: (show: boolean) => void
  recentPages: NavItem[]
  addToRecentPages: (item: NavItem) => void
}

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType
  badge?: string
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [pinnedItems, setPinnedItems] = useState<NavItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [recentPages, setRecentPages] = useState<NavItem[]>([])
  
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    setMounted(true)
    // Load preferences
    const savedCollapsed = localStorage.getItem("sidebarCollapsed")
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Safely parse the collapsed state
    try {
      if (savedCollapsed) {
        setIsCollapsed(JSON.parse(savedCollapsed))
      }
    } catch (error) {
      console.error("Error parsing sidebarCollapsed:", error)
      setIsCollapsed(false)
    }

    // Handle theme value which might be a string ('light'/'dark') or a boolean
    if (savedTheme) {
      try {
        if (savedTheme === "dark") {
          setIsDarkMode(true)
        } else if (savedTheme === "light") {
          setIsDarkMode(false)
        } else {
          // Try to parse as JSON boolean
          setIsDarkMode(JSON.parse(savedTheme))
        }
      } catch (error) {
        console.error("Error parsing theme:", error)
        setIsDarkMode(prefersDark)
      }
    } else {
      setIsDarkMode(prefersDark)
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => {
      const newState = !prev
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState))
      return newState
    })
  }, [])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newState = !prev
      // Store as string 'dark' or 'light' instead of JSON boolean
      localStorage.setItem("theme", newState ? "dark" : "light")
      document.documentElement.classList.toggle("dark", newState)
      return newState
    })
  }, [])

  const togglePinItem = useCallback((item: NavItem) => {
    setPinnedItems(prev => {
      const isPinned = prev.some(i => i.href === item.href)
      const newPinned = isPinned 
        ? prev.filter(i => i.href !== item.href)
        : [...prev, item]
      localStorage.setItem("pinnedItems", JSON.stringify(newPinned))
      return newPinned
    })
  }, [])

  const addToRecentPages = useCallback((item: NavItem) => {
    setRecentPages(prev => {
      const filtered = prev.filter(i => i.href !== item.href)
      const newRecent = [item, ...filtered].slice(0, 5)
      localStorage.setItem("recentPages", JSON.stringify(newRecent))
      return newRecent
    })
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SidebarContext.Provider value={{
      isCollapsed,
      toggleSidebar,
      isDarkMode,
      toggleDarkMode,
      isMobile,
      pinnedItems,
      togglePinItem,
      searchQuery,
      setSearchQuery,
      showSearchResults,
      setShowSearchResults,
      recentPages,
      addToRecentPages
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}