"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Wallet,
  LineChart,
  History,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Zap,
  Search,
  Pin,
  Star,
  Clock,
  SunMoon,
  Repeat,
  BookOpen,
} from "lucide-react"

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
  badge?: string
  badgeColor?: string
  isPinned?: boolean
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const [searchQuery, setSearchQuery] = useState("")
  const [recentPages, setRecentPages] = useState<NavItem[]>([])
  const [pinnedItems, setPinnedItems] = useState<NavItem[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Updated nav items to align with Bumblebee's features
  const allNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
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

  // Main nav items excluding pinned items
  const mainNavItems = allNavItems.filter(
    (item) => 
      item.href !== "/dashboard/settings" && 
      item.href !== "/dashboard/help" && 
      !pinnedItems.some(pinned => pinned.href === item.href)
  )

  // Utility nav items excluding pinned items
  const utilityNavItems = allNavItems.filter(
    (item) => 
      (item.href === "/dashboard/settings" || item.href === "/dashboard/help") && 
      !pinnedItems.some(pinned => pinned.href === item.href)
  )

  // Filtered items based on search
  const filteredItems = allNavItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Track recently visited pages
  useEffect(() => {
    if (pathname) {
      const currentPage = allNavItems.find(item => item.href === pathname)
      if (currentPage) {
        setRecentPages(prev => {
          const filtered = prev.filter(item => item.href !== pathname)
          return [currentPage, ...filtered].slice(0, 3)
        })
      }
    }
  }, [pathname])

  // Handle pin/unpin item
  const togglePinItem = (item: NavItem) => {
    setPinnedItems(prev => {
      const isPinned = prev.some(pinned => pinned.href === item.href)
      
      if (isPinned) {
        return prev.filter(pinned => pinned.href !== item.href)
      } else {
        return [...prev, item].slice(0, 4) // Limit to 4 pinned items
      }
    })
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
    document.documentElement.classList.toggle('dark')
  }

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "70px" },
  }

  const NavItem = ({ item, showPin = true }: { item: NavItem; showPin?: boolean }) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
    const isPinned = pinnedItems.some(pinned => pinned.href === item.href)

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center relative">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-primary-light dark:hover:bg-primary-light/10 group relative flex-grow",
                  isActive
                    ? "bg-primary-light dark:bg-primary-light/10 text-primary-dark dark:text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "transition-colors flex items-center justify-center w-6 h-6",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                  )}
                >
                  {item.icon}
                </div>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm flex-1 whitespace-nowrap overflow-hidden"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!isCollapsed && item.badge && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full font-medium",
                      item.badgeColor || "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                    layoutId="activeNavIndicator"
                    transition={{ type: "spring", duration: 0.3 }}
                  />
                )}
              </Link>
              {!isCollapsed && showPin && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    togglePinItem(item)
                  }}
                  className={cn(
                    "h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary-light dark:hover:bg-primary-light/10 transition-opacity",
                    isPinned && "opacity-100"
                  )}
                >
                  <Pin className={cn("h-4 w-4", isPinned && "fill-primary text-primary")} />
                  <span className="sr-only">{isPinned ? "Unpin" : "Pin"}</span>
                </Button>
              )}
            </div>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="flex items-center gap-2 bg-card border border-border shadow-md">
              {item.title}
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

  return (
    <motion.div
      variants={sidebarVariants}
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "flex flex-col border-r bg-card h-screen shadow-sm z-20 relative",
        isDarkMode && "dark"
      )}
    >
      <div className="flex h-16 items-center justify-between px-3 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <motion.div 
            className="relative h-9 w-9 overflow-hidden rounded-full bg-primary/10 p-1.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src="/bee-logo.png" alt="Bumblebee Logo" fill className="object-cover" />
          </motion.div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-heading font-bold text-lg text-gradient-gold"
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
                  className="h-8 w-8 rounded-full hover:bg-primary-light dark:hover:bg-primary-light/10"
                  onClick={toggleDarkMode}
                >
                  <SunMoon className="h-4 w-4" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-primary-light dark:hover:bg-primary-light/10"
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
                className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            
            <AnimatePresence>
              {showSearchResults && filteredItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 mt-1 w-64 rounded-md border bg-card shadow-lg"
                >
                  <div className="py-1">
                    {filteredItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-light dark:hover:bg-primary-light/10"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <span className="flex h-6 w-6 items-center justify-center">{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-6">
          {pinnedItems.length > 0 && (
            <div className="space-y-1">
              <div className={cn("mb-2 px-4", isCollapsed ? "sr-only" : "")}>
                <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                  <Star className="h-3 w-3" /> Pinned
                </h3>
              </div>
              <nav className="space-y-1">
                {pinnedItems.map((item) => (
                  <NavItem key={`pinned-${item.href}`} item={item} />
                ))}
              </nav>
            </div>
          )}

          {!isCollapsed && recentPages.length > 0 && (
            <div className="space-y-1">
              <div className="mb-2 px-4">
                <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Recent
                </h3>
              </div>
              <nav className="space-y-1">
                {recentPages.map((item) => (
                  <NavItem key={`recent-${item.href}`} item={item} showPin={false} />
                ))}
              </nav>
            </div>
          )}

          <div className="space-y-1">
            <div className={cn("mb-2 px-4", isCollapsed ? "sr-only" : "")}>
              <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Main</h3>
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          </div>

          <div className="space-y-1">
            <div className={cn("mb-2 px-4", isCollapsed ? "sr-only" : "")}>
              <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Utilities</h3>
            </div>
            <nav className="space-y-1">
              {utilityNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto border-t p-3">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer",
            isCollapsed ? "justify-center" : "",
          )}
        >
          <motion.div 
            className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src="/avatars/woman-1.png" alt="User Avatar" fill className="object-cover" />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
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
                <p className="truncate text-sm font-medium">Sarah Johnson</p>
                <p className="truncate text-xs text-muted-foreground">Premium User</p>
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
                  className="h-8 w-8 rounded-full hover:bg-primary-light dark:hover:bg-primary-light/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}