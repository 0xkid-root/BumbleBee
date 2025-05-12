"use client"

import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Wallet,
  LineChart,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Pin,
  SunMoon,
  ArrowRightLeft,
  PiggyBank,
  Coins,
  BookOpen,
  Repeat,
  ExternalLink,
} from "lucide-react"
import { debounce } from "lodash"

// Types
interface NavItem {
  title: string
  href?: string
  icon: React.ReactNode
  badge?: string
  badgeColor?: string
  isExternal?: boolean
  isDisabled?: boolean
  onClick?: () => void
}

interface AuthHook {
  user: { name: string }
  address: string
  disconnect: () => void
}

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  isDarkMode: boolean
  toggleDarkMode: () => void
  notificationCount: number
}

// Navigation Configuration
const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" aria-hidden="true" /> },
  { title: "Smart Wallet", href: "/dashboard/wallet", icon: <Wallet className="h-5 w-5" aria-hidden="true" /> },
  { title: "Portfolio", href: "/dashboard/portfolio", icon: <LineChart className="h-5 w-5" aria-hidden="true" />, badge: "Coming soon", badgeColor: "bg-white text-indigo-300" },
  { title: "Subscriptions", href: "/dashboard/subscriptions", icon: <Repeat className="h-5 w-5" aria-hidden="true" /> },
  { title: "Social Payments", href: "/dashboard/social", icon: <Users className="h-5 w-5" aria-hidden="true" /> },
  { title: "Token Swap", href: "/dashboard/swap", icon: <ArrowRightLeft className="h-5 w-5" aria-hidden="true" />, badge: "Coming soon", badgeColor: "bg-white text-indigo-300" },
  { title: "AI Education", href: "/dashboard/education", icon: <BookOpen className="h-5 w-5" aria-hidden="true" />, badge: "Coming soon", badgeColor: "bg-white text-indigo-300" },
  { title: "Savings", href: "/dashboard/savings", icon: <PiggyBank className="h-5 w-5" aria-hidden="true" />, badge: "Coming soon",badgeColor: "bg-white text-indigo-300" },
  { title: "DeFi Yields", href: "/dashboard/defi", icon: <Coins className="h-5 w-5" aria-hidden="true" />, badge: "Coming soon",badgeColor: "bg-white text-indigo-300" },
  { title: "Settings", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" aria-hidden="true" /> },
  { title: "Help & Support", href: "/dashboard/help", icon: <HelpCircle className="h-5 w-5" aria-hidden="true" /> },
]

// Mock toast and useAuth (unchanged)
const toast = ({ title, description, variant }: { title: string; description: string; variant: string }) => {
  console.log(`Toast: ${title} - ${description} (${variant})`)
}

const useAuth = (): AuthHook => ({
  user: { name: "Sarah Johnson" },
  address: "0x1234...5678",
  disconnect: () => console.log("Disconnected"),
})

const isValidPinnedItems = (data: unknown): data is NavItem[] => {
  return Array.isArray(data) && data.every((item) => typeof item.title === "string" && typeof item.href === "string")
}

// Sidebar Context (unchanged)
const SidebarContext = React.createContext<SidebarContextType>({
  isCollapsed: false,
  toggleSidebar: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
  notificationCount: 0,
})

export const useSidebar = () => React.useContext(SidebarContext)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notificationCount] = useState(3)

  useEffect(() => {
    try {
      const savedSidebarState = localStorage.getItem("sidebarCollapsed")
      if (savedSidebarState !== null) {
        setIsCollapsed(JSON.parse(savedSidebarState) as boolean)
      }

      const savedThemeState = localStorage.getItem("darkMode")
      const isDark = savedThemeState !== null ? (JSON.parse(savedThemeState) as boolean) : window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(isDark)
      document.documentElement.classList.toggle("dark", isDark)
    } catch (error) {
      console.error("Failed to load preferences:", error)
      toast({ title: "Error", description: "Failed to load preferences.", variant: "destructive" })
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newState = !prev
      try {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState))
      } catch (error) {
        console.error("Failed to save sidebar state:", error)
        toast({ title: "Error", description: "Failed to save sidebar preferences.", variant: "destructive" })
      }
      return newState
    })
  }, [])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const newState = !prev
      document.documentElement.classList.toggle("dark", newState)
      try {
        localStorage.setItem("darkMode", JSON.stringify(newState))
      } catch (error) {
        console.error("Failed to save theme state:", error)
        toast({ title: "Error", description: "Failed to save theme preferences.", variant: "destructive" })
      }
      return newState
    })
  }, [])

  const contextValue = useMemo(
    () => ({ isCollapsed, toggleSidebar, isDarkMode, toggleDarkMode, notificationCount }),
    [isCollapsed, toggleSidebar, isDarkMode, toggleDarkMode, notificationCount]
  )

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>
}

// Lazy-loaded components (unchanged)
const LazyMobileSidebar = lazy(() => import("./sidebar-components/mobile-sidebar").then((mod) => ({ default: mod.MobileSidebar })))
const LazySearchResults = lazy(() => import("./sidebar-components/search-results").then((mod) => ({ default: mod.SearchResults })))

// Skeleton Component (unchanged)
const SidebarSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4" role="status" aria-label="Loading sidebar">
    <div className="h-8 w-3/4 bg-muted rounded"></div>
    <div className="space-y-2">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded"></div>
        ))}
    </div>
  </div>
)

// Animation Variants (unchanged)
const sidebarVariants = {
  expanded: { width: "280px", transition: { type: "spring", stiffness: 300, damping: 30 } },
  collapsed: { width: "70px", transition: { type: "spring", stiffness: 300, damping: 30 } },
}

const itemVariants = {
  expanded: { opacity: 1, x: 0 },
  collapsed: { opacity: 0, x: -10 },
}

const badgeVariants = {
  expanded: { scale: 1, opacity: 1 },
  collapsed: { scale: 0, opacity: 0 },
}

/**
 * NavItem component for rendering sidebar navigation items
 */
const NavItem = React.memo(
  ({ item, showPin = true, isPinned = false, togglePinItem, pathname }: {
    item: NavItem
    showPin?: boolean
    isPinned?: boolean // Added isPinned prop
    togglePinItem?: (item: NavItem) => void
    pathname: string
  }) => {
    const { isCollapsed } = useSidebar()
    const isActive = pathname === item.href || (!item.isExternal && item.href !== "/dashboard" && pathname.startsWith(item.href || ""))

    const handlePinClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        if (togglePinItem) togglePinItem(item)
      },
      [item, togglePinItem]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (!item.isDisabled && item.onClick) item.onClick()
          if (item.href && !item.isExternal) window.location.href = item.href
        }
      },
      [item]
    )

    const navItemContent = (
      <motion.div whileHover={!item.isDisabled ? { scale: 1.05 } : {}} whileTap={!item.isDisabled ? { scale: 0.95 } : {}} className="flex items-center gap-3 w-full">
        <motion.div className={cn("w-6 h-6", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary", item.isDisabled && "opacity-50")}>{item.icon}</motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span variants={itemVariants} initial="collapsed" animate="expanded" exit="collapsed" className="text-sm flex-1 font-medium">
              {item.title}
              {item.isExternal && <ExternalLink className="ml-1 inline h-3 w-3" aria-hidden="true" />}
            </motion.span>
          )}
        </AnimatePresence>
        {!isCollapsed && item.badge && (
          <motion.span variants={badgeVariants} initial="collapsed" animate="expanded" exit="collapsed" className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", item.badgeColor || "bg-muted text-muted-foreground")}>
            {item.badge}
          </motion.span>
        )}
        {isActive && <motion.div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" layoutId="activeNavIndicator" />}
      </motion.div>
    )

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center relative group" role="listitem">
              {item.href && !item.isDisabled ? (
                item.isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-primary/10 relative flex-grow",
                      isActive ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={item.isDisabled}
                    onKeyDown={handleKeyDown}
                  >
                    {navItemContent}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-primary/10 relative flex-grow",
                      isActive ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={item.isDisabled}
                    onKeyDown={handleKeyDown}
                  >
                    {navItemContent}
                  </Link>
                )
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 relative flex-grow",
                    item.isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10 cursor-pointer text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => !item.isDisabled && item.onClick && item.onClick()}
                  onKeyDown={handleKeyDown}
                  role="button"
                  tabIndex={item.isDisabled ? -1 : 0}
                  aria-disabled={item.isDisabled}
                >
                  {navItemContent}
                </div>
              )}
              {!isCollapsed && showPin && !item.isDisabled && togglePinItem && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePinClick}
                  onKeyDown={(e) => e.key === "Enter" && handlePinClick(e as any)}
                  className={cn("h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary/10", isPinned && "opacity-100")}
                  aria-label={isPinned ? `Unpin ${item.title}` : `Pin ${item.title}`}
                >
                  <Pin className={cn("h-4 w-4", isPinned && "fill-primary text-primary")} aria-hidden="true" />
                </Button>
              )}
            </div>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="flex items-center gap-2 bg-card border rounded-lg">
              {item.title}
              {item.isExternal && <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />}
              {item.badge && <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", item.badgeColor || "bg-muted text-muted-foreground")}>{item.badge}</span>}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  }
)

// ErrorBoundary (unchanged)
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="p-4 text-center" role="alert">
        <p className="text-sm text-muted-foreground">Failed to load component.</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => setHasError(false)} aria-label="Retry loading component">
          Retry
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * SidebarContent component for rendering sidebar content
 */
const SidebarContent = React.memo(
  ({ pinnedItems, togglePinItem, searchQuery, setSearchQuery, showSearchResults, setShowSearchResults }: {
    pinnedItems: NavItem[]
    togglePinItem: (item: NavItem) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    showSearchResults: boolean // Fixed typo from show_phase
    setShowSearchResults: (show: boolean) => void
  }) => {
    const { isCollapsed, toggleSidebar, toggleDarkMode, isDarkMode } = useSidebar()
    const pathname = usePathname()
    const { user, address, disconnect } = useAuth()

    const filteredItems = useMemo(() => NAV_ITEMS.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery])

    const categorizedNavItems = useMemo(() => {
      const main = NAV_ITEMS.filter((item) =>
        ["/dashboard", "/dashboard/wallet", "/dashboard/portfolio", "/dashboard/subscriptions", "/dashboard/social", "/dashboard/swap", "/dashboard/education"].includes(item.href || "")
      ).filter((item) => !pinnedItems.some((p) => p.href === item.href))
      const finance = NAV_ITEMS.filter((item) => ["/dashboard/savings", "/dashboard/defi"].includes(item.href || "")).filter((item) => !pinnedItems.some((p) => p.href === item.href))
      const utility = NAV_ITEMS.filter((item) => ["/dashboard/settings", "/dashboard/help"].includes(item.href || "")).filter((item) => !pinnedItems.some((p) => p.href === item.href))
      return { main, finance, utility }
    }, [pinnedItems])

    const debouncedSearch = useCallback(
      debounce((value: string) => {
        const sanitizedValue = value.replace(/[<>]/g, "")
        setSearchQuery(sanitizedValue)
        setShowSearchResults(sanitizedValue.length > 0)
      }, 300),
      []
    )

    return (
      <nav aria-label="Main sidebar navigation">
        <div className="flex h-14 items-center justify-between px-3 border-b">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="Go to Dashboard">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-lg bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent"
                >
                  Bumblebee
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                    onClick={toggleDarkMode}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    <SunMoon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? <ChevronRight className="h-8 w-8" aria-hidden="true" /> : <ChevronLeft className="h-8 w-8" aria-hidden="true" />}
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4" role="list">
            {!isCollapsed && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  placeholder="Search..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="pl-8 text-sm"
                  aria-label="Search navigation"
                  maxLength={100}
                />
              </div>
            )}
            {showSearchResults ? (
              <Suspense fallback={<SidebarSkeleton />}>
                <ErrorBoundary>
                  {/* Verify SearchResults props in ./sidebar-components/search-results.tsx */}
                  <LazySearchResults query={searchQuery} items={filteredItems} />
                </ErrorBoundary>
              </Suspense>
            ) : (
              <>
                {pinnedItems.length > 0 && (
                  <div className="space-y-1">
                    <h4 className={cn("text-xs font-semibold text-muted-foreground uppercase", isCollapsed && "hidden")} aria-hidden={isCollapsed}>
                      Pinned
                    </h4>
                    {pinnedItems.map((item) => (
                      <NavItem
                        key={item.href}
                        item={item}
                        showPin
                        isPinned={true} // Pinned items are always pinned
                        togglePinItem={togglePinItem}
                        pathname={pathname}
                      />
                    ))}
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className={cn("text-xs font-semibold text-muted-foreground uppercase", isCollapsed && "hidden")} aria-hidden={isCollapsed}>
                    Main
                  </h4>
                  {categorizedNavItems.main.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      showPin
                      // isPinned defaults to false for non-pinned items
                      togglePinItem={togglePinItem}
                      pathname={pathname}
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <h4 className={cn("text-xs font-semibold text-muted-foreground uppercase", isCollapsed && "hidden")} aria-hidden={isCollapsed}>
                    Finance
                  </h4>
                  {categorizedNavItems.finance.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      showPin
                      // isPinned defaults to false
                      togglePinItem={togglePinItem}
                      pathname={pathname}
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <h4 className={cn("text-xs font-semibold text-muted-foreground uppercase", isCollapsed && "hidden")} aria-hidden={isCollapsed}>
                    Utility
                  </h4>
                  {categorizedNavItems.utility.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      showPin
                      // isPinned defaults to false
                      togglePinItem={togglePinItem}
                      pathname={pathname}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center" aria-hidden="true">
              <span className="text-xs font-medium">{user.name[0]}</span>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{address}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={disconnect}
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              aria-label="Disconnect wallet"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </nav>
    )
  }
)

/**
 * Main DashboardSidebar component
 */
export function DashboardSidebar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [pinnedItems, setPinnedItems] = useState<NavItem[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isMobileMenuOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const loadPinnedItems = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 300))
        const savedPinnedItems = localStorage.getItem("pinnedItems")
        if (savedPinnedItems) {
          const parsed = JSON.parse(savedPinnedItems)
          if (isValidPinnedItems(parsed)) {
            setPinnedItems(parsed)
          } else {
            throw new Error("Invalid pinned items format")
          }
        }
      } catch (error) {
        console.error("Failed to load pinned items:", error)
        toast({ title: "Error", description: "Failed to load pinned items.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    loadPinnedItems()
  }, [])

  const togglePinItem = useCallback((item: NavItem) => {
    setPinnedItems((prev) => {
      const isPinned = prev.some((pinned) => pinned.href === item.href)
      const newPinnedItems = isPinned ? prev.filter((pinned) => pinned.href !== item.href) : [...prev, item].slice(0, 4)
      try {
        localStorage.setItem("pinnedItems", JSON.stringify(newPinnedItems))
      } catch (error) {
        console.error("Failed to save pinned items:", error)
        toast({ title: "Error", description: "Failed to save pinned items.", variant: "destructive" })
      }
      return newPinnedItems
    })
  }, [])

  const { isCollapsed } = useSidebar()
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", isCollapsed ? "70px" : "280px")
  }, [isCollapsed])

  return (
    <>
      <motion.div
        variants={sidebarVariants}
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className={cn("hidden md:flex flex-col border-r bg-card h-screen shadow-md fixed left-0 top-0 will-change-[width]")}
        style={{ width: isCollapsed ? "70px" : "280px" }}
        role="complementary"
        aria-label="Sidebar"
      >
        {isLoading ? <SidebarSkeleton /> : (
          <SidebarContent
            pinnedItems={pinnedItems}
            togglePinItem={togglePinItem}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showSearchResults={showSearchResults}
            setShowSearchResults={setShowSearchResults}
          />
        )}
      </motion.div>
      <Suspense fallback={null}>
        <ErrorBoundary>
          {/* Verify MobileSidebar props in ./sidebar-components/mobile-sidebar.tsx */}
          <LazyMobileSidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            navItems={NAV_ITEMS}
            pinnedItems={pinnedItems}
            togglePinItem={togglePinItem}
            variants={{ closed: { x: "-100%" }, open: { x: 0 } }}
            overlayVariants={{ closed: { opacity: 0 }, open: { opacity: 0.5 } }}
          />
        </ErrorBoundary>
      </Suspense>
    </>
  )
}