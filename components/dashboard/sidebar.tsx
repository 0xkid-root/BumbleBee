"use client"

import { useState, useEffect, createContext, useContext, lazy, Suspense, useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Zap,
  Search,
  Pin,
  Star,
  SunMoon,
  Repeat,
  BookOpen,
  Moon,
  X,
  ExternalLink,
  CreditCard,
  PanelLeft,
  PanelLeftClose,
  Sun,
  Bell,
  Clock,
  Sparkles,
  Coins,
  ArrowRightLeft,
  PiggyBank,
  BarChart,
  BadgeDollarSign,
  MessageSquare,
  Activity,
  ListChecks,
  PlayCircle,
  Gift,
  User2,
  Plus,
} from "lucide-react"

import { NavItem, AuthHook, SidebarContextType } from "./sidebar-types"

// Mock useAuth hook
const useAuth = (): AuthHook => {
  return {
    user: { name: "Sarah Johnson" },
    address: "0x1234...5678",
    disconnect: () => console.log("Disconnected"),
  }
}

// Create sidebar context
const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleSidebar: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
})

// Export the useSidebar hook for components to access the sidebar context
export const useSidebar = () => useContext(SidebarContext)

// Export the SidebarProvider to be used in dashboard-layout.tsx
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    try {
      const savedSidebarState = localStorage.getItem("sidebarCollapsed")
      if (savedSidebarState !== null) {
        setIsCollapsed(JSON.parse(savedSidebarState))
      }

      const savedThemeState = localStorage.getItem("darkMode")
      if (savedThemeState !== null) {
        const isDark = JSON.parse(savedThemeState)
        setIsDarkMode(isDark)
        if (isDark) {
          document.documentElement.classList.add("dark")
        }
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setIsDarkMode(true)
        document.documentElement.classList.add("dark")
      }
    } catch (error) {
      console.error("Failed to load saved states:", error)
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    try {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState))
    } catch (error) {
      console.error("Failed to save sidebar state:", error)
    }
  }

  const toggleDarkMode = () => {
    const newState = !isDarkMode
    setIsDarkMode(newState)
    document.documentElement.classList.toggle("dark", newState)
    try {
      localStorage.setItem("darkMode", JSON.stringify(newState))
    } catch (error) {
      console.error("Failed to save theme state:", error)
    }
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isDarkMode, toggleDarkMode }}>
      {children}
    </SidebarContext.Provider>
  )
}

// Lazy-loaded components
const LazyMobileSidebar = lazy(() => import("./sidebar-components/mobile-sidebar").then(mod => ({ default: mod.MobileSidebar })))
const LazySearchResults = lazy(() => import("./sidebar-components/search-results").then(mod => ({ default: mod.SearchResults })))

// Loading fallbacks
const SidebarSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-8 w-3/4 bg-muted rounded"></div>
    <div className="space-y-2">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="h-10 bg-muted rounded"></div>
      ))}
    </div>
  </div>
)

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, toggleSidebar, isDarkMode, toggleDarkMode } = useSidebar()
  const [searchQuery, setSearchQuery] = useState("")
  const [pinnedItems, setPinnedItems] = useState<NavItem[]>([])
  const [recentPages, setRecentPages] = useState<NavItem[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { user, address, disconnect } = useAuth()

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isMobileMenuOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "auto"
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      document.body.style.overflow = "auto"
    }
  }, [isMobileMenuOpen])

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Load pinned and recent pages from localStorage
  useEffect(() => {
    const loadSavedState = async () => {
      setIsLoading(true)
      try {
        // Simulate network delay for demonstration purposes
        // In a real app, this would be actual data fetching
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const savedPinnedItems = localStorage.getItem("pinnedItems")
        if (savedPinnedItems) {
          setPinnedItems(JSON.parse(savedPinnedItems))
        }
        
        const savedRecentPages = localStorage.getItem("recentPages")
        if (savedRecentPages) {
          setRecentPages(JSON.parse(savedRecentPages))
        }
      } catch (error) {
        console.error("Failed to load saved navigation state:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSavedState()
  }, [])

  // Track recent pages
  useEffect(() => {
    if (pathname && !isLoading) {
      const currentPage = allNavItems.find((item) => item.href === pathname && !item.isExternal && !item.isDisabled)
      if (currentPage) {
        setRecentPages((prev) => {
          const filtered = prev.filter((item) => item.href !== pathname)
          const newRecentPages = [currentPage, ...filtered].slice(0, 5)
          try {
            localStorage.setItem("recentPages", JSON.stringify(newRecentPages))
          } catch (error) {
            console.error("Failed to save recent pages:", error)
          }
          return newRecentPages
        })
      }
    }
  }, [pathname, isLoading])

  // Updated nav items
  const allNavItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    {
      title: "Smart Wallet",
      href: "/dashboard/wallet",
      icon: <Wallet className="h-5 w-5" />,
      badge: "AI",
      badgeColor: "bg-primary text-primary-foreground",
    },
    {
      title: "Portfolio",
      href: "/dashboard/portfolio",
      icon: <LineChart className="h-5 w-5" />,
      badge: "New",
      badgeColor: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Subscriptions",
      href: "/dashboard/subscriptions",
      icon: <Repeat className="h-5 w-5" />,
    },
    {
      title: "Social Payments",
      href: "/dashboard/social",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Token Swap",
      href: "/dashboard/swap",
      icon: <Zap className="h-5 w-5" />,
      badge: "Beginner",
      badgeColor: "bg-accent text-accent-foreground",
    },
    {
      title: "AI Education",
      href: "/dashboard/education",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Help & Support",
      href: "/dashboard/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ]

  const mainNavItems = allNavItems.filter(
    (item) =>
      item.href !== "/dashboard/settings" &&
      item.href !== "/dashboard/help" &&
      !pinnedItems.some((pinned) => pinned.href === item.href),
  )

  const utilityNavItems = allNavItems.filter(
    (item) =>
      (item.href === "/dashboard/settings" || item.href === "/dashboard/help timings") &&
      !pinnedItems.some((pinned) => pinned.href === item.href),
  )

  const filteredItems = allNavItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const togglePinItem = (item: NavItem) => {
    setPinnedItems((prev) => {
      const isPinned = prev.some((pinned) => pinned.href === item.href)
      let newPinnedItems
      if (isPinned) {
        newPinnedItems = prev.filter((pinned) => pinned.href !== item.href)
      } else {
        newPinnedItems = [...prev, item].slice(0, 4)
      }
      try {
        localStorage.setItem("pinnedItems", JSON.stringify(newPinnedItems))
      } catch (error) {
        console.error("Failed to save pinned items:", error)
      }
      return newPinnedItems
    })
  }

  // Animation variants
  const sidebarVariants = {
    expanded: {
      width: "280px",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    collapsed: {
      width: "70px",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  }

  const mobileMenuVariants = {
    closed: { x: "-100%", transition: { type: "spring", stiffness: 400, damping: 40 } },
    open: { x: 0, transition: { type: "spring", stiffness: 400, damping: 40 } },
  }

  // Define overlay variants with custom CSS classes instead of direct pointerEvents
  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 0.5 },
  }

  const itemVariants = {
    expanded: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
    collapsed: { opacity: 0, x: -10, transition: { type: "spring", stiffness: 300, damping: 20 } },
  }

  const iconVariants = {
    expanded: { rotate: 0 },
    collapsed: { rotate: 360, transition: { duration: 0.5 } },
  }

  const badgeVariants = {
    expanded: { scale: 1, opacity: 1 },
    collapsed: { scale: 0, opacity: 0 },
  }

  const NavItem = ({ item, showPin = true }: { item: NavItem; showPin?: boolean }) => {
    const isActive = pathname === item.href || (!item.isExternal && item.href !== "/dashboard" && pathname.startsWith(item.href))
    const isPinned = pinnedItems.some((pinned) => pinned.href === item.href)
    
    // Determine if the item should be rendered as a link or button
    const isLink = !item.isDisabled && (item.href || item.onClick)
    
    // Create the content of the nav item
    const navItemContent = (
      <motion.div
        whileHover={!item.isDisabled ? { scale: 1.05 } : {}}
        whileTap={!item.isDisabled ? { scale: 0.95 } : {}}
        className="flex items-center gap-3 w-full"
      >
        <motion.div
          variants={iconVariants}
          initial={false}
          animate={isCollapsed ? "collapsed" : "expanded"}
          className={cn(
            "transition-colors flex items-center justify-center w-6 h-6",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
            item.isDisabled && "opacity-50"
          )}
        >
          {item.icon}
        </motion.div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.span
              variants={itemVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="text-sm flex-1 whitespace-nowrap overflow-hidden font-medium"
            >
              {item.title}
              {item.isExternal && (
                <ExternalLink className="ml-1 inline h-3 w-3" />
              )}
            </motion.span>
          )}
        </AnimatePresence>

        {!isCollapsed && item.badge && (
          <motion.span
            variants={badgeVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-medium",
              item.badgeColor || "bg-muted text-muted-foreground",
            )}
          >
            {item.badge}
          </motion.span>
        )}

        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary"
            layoutId="activeNavIndicator"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.div>
    )

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center relative group">
              {isLink ? (
                item.isExternal ? (
                  // External link
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault()
                        item.onClick()
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-primary/10 group relative flex-grow",
                      isActive
                        ? "bg-primary/15 dark:bg-primary/20 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {navItemContent}
                  </a>
                ) : (
                  // Internal link with Next.js Link
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault()
                        item.onClick()
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-primary/10 group relative flex-grow",
                      isActive
                        ? "bg-primary/15 dark:bg-primary/20 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {navItemContent}
                  </Link>
                )
              ) : (
                // Disabled or button-only item
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group relative flex-grow",
                    item.isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary/10 cursor-pointer text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => {
                    if (!item.isDisabled && item.onClick) {
                      item.onClick()
                    }
                  }}
                >
                  {navItemContent}
                </div>
              )}
              
              {!isCollapsed && showPin && !item.isDisabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    togglePinItem(item)
                  }}
                  className={cn(
                    "h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary/10 transition-opacity",
                    isPinned && "opacity-100",
                  )}
                >
                  <Pin className={cn("h-4 w-4", isPinned && "fill-primary text-primary")} />
                  <span className="sr-only">{isPinned ? "Unpin" : "Pin"}</span>
                </Button>
              )}
            </div>
          </TooltipTrigger>
          
          {isCollapsed && (
            <TooltipContent side="right" className="flex items-center gap-2 bg-card border border-border shadow-lg rounded-lg">
              {item.title}
              {item.isExternal && <ExternalLink className="ml-1 h-3 w-3" />}
              {item.badge && (
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full font-medium",
                    item.badgeColor || "bg-muted text-muted-foreground",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Error boundary component for lazy-loaded components
  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
      const handleError = () => setHasError(true)
      window.addEventListener('error', handleError)
      return () => window.removeEventListener('error', handleError)
    }, [])

    if (hasError) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Something went wrong.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => setHasError(false)}
          >
            Try again
          </Button>
        </div>
      )
    }

    return <>{children}</>
  }

  const DesktopSidebar = () => (
    <motion.div
      variants={sidebarVariants}
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      className={cn(
        "hidden md:flex flex-col border-r bg-card h-screen shadow-md z-20 fixed left-0 top-0",
        isDarkMode && "dark",
      )}
    >
      {isLoading ? <SidebarSkeleton /> : <SidebarContent />}
    </motion.div>
  )

  // Function to add visited pages to recent pages
  const addToRecentPages = (item: NavItem) => {
    if (!item.isDisabled && !item.isExternal) {
      setRecentPages((prev) => {
        const filtered = prev.filter((page) => page.href !== item.href)
        const newRecentPages = [item, ...filtered].slice(0, 5)
        try {
          localStorage.setItem("recentPages", JSON.stringify(newRecentPages))
        } catch (error) {
          console.error("Failed to save recent pages:", error)
        }
        return newRecentPages
      })
    }
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-between px-3 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <motion.div
            className="relative h-9 w-9 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src="/bee-logo.png" alt="Bumblebee Logo" fill className="object-cover p-1" />
          </motion.div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-heading font-bold text-lg bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent"
              >
                Bumblebee
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        <div className="flex items-center gap-2">
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-primary/10"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? <SunMoon className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </motion.div>
  )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-primary/10"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
        
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pt-4"
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchResults(e.target.value.length > 0)
                }}
                onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="w-full rounded-lg border bg-background/50 backdrop-blur-sm py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <AnimatePresence>
              {showSearchResults && filteredItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 mt-1 w-64 rounded-lg border bg-card shadow-lg"
                >
                  <div className="py-1">
                    {filteredItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <span className="flex h-6 w-6 items-center justify-center text-primary">{item.icon}</span>
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className={cn("ml-auto text-xs px-1.5 py-0.5 rounded-full", item.badgeColor)}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollArea className="flex-1 py-4 px-2">
        <div className="space-y-6">
          {pinnedItems.length > 0 && (
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, staggerChildren: 0.05, delayChildren: 0.1 }}
            >
              <div className={cn("mb-2 px-4", isCollapsed ? "sr-only" : "")}>
                <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                  <Star className="h-3 w-3 text-amber-500" /> Pinned
                </h3>
              </div>
              <nav className="space-y-1">
                {pinnedItems.map((item) => (
                  <NavItem key={`pinned-${item.href}`} item={item} />
                ))}
              </nav>
            </motion.div>
          )}

          {recentPages.length > 0 && (
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, staggerChildren: 0.05, delayChildren: 0.1 }}
            >
              <div className={cn("mb-2 px-4", isCollapsed ? "sr-only" : "")}>
                <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                  <Repeat className="h-3 w-3 text-blue-500" /> Recent
                </h3>
              </div>
              <nav className="space-y-1">
                {recentPages.map((item) => (
                  <NavItem key={`recent-${item.href}`} item={item} showPin={false} />
                ))}
              </nav>
            </motion.div>
          )}

          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, staggerChildren: 0.05, delayChildren: 0.1 }}
          >
            <div className={cn("mb-2 px-4", isCollapsed ? "sr-only" : "")}>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Main</h3>
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          </motion.div>

          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, staggerChildren: 0.05, delayChildren: 0.1 }}
          >
            <div className={cn("mb-2 px-4", isCollapsed ? "sr-only" : "")}>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Utilities</h3>
            </div>
            <nav className="space-y-1">
              {utilityNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          </motion.div>
        </div>
      </ScrollArea>

      <div className="mt-auto border-t p-3">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-primary/10 group cursor-pointer",
            isCollapsed ? "justify-center" : "",
          )}
        >
          <motion.div
            className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 flex-shrink-0 shadow-sm group-hover:border-primary/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src="/avatars/woman-1.png" alt="User Avatar" fill className="object-cover" />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card shadow-sm"></div>
          </motion.div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-hidden"
              >
                <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
                <p className="truncate text-xs text-muted-foreground font-mono">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Wallet not connected"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-rose-500/10 group-hover:text-rose-500 transition-colors"
                  onClick={() => {
                    disconnect()
                    router.push("/")
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <ErrorBoundary>
        <Suspense fallback={<div className="md:hidden fixed bottom-4 right-4 h-12 w-12 rounded-full bg-primary/50 animate-pulse"></div>}>
          {isMobileMenuOpen && (
            <LazyMobileSidebar
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              overlayVariants={overlayVariants}
              mobileMenuVariants={mobileMenuVariants}
              SidebarContent={SidebarContent}
            />
          )}
        </Suspense>
      </ErrorBoundary>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed bottom-4 right-4 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg z-50 hover:bg-primary/90"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <LayoutDashboard className="h-5 w-5" />
      </Button>
    </>
  )
}