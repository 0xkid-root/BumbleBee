"use client"
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense, ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
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
  X,
} from "lucide-react"
import { debounce } from "lodash"

// Types
interface NavItem {
  title: string
  href: string
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

// Lazy-loaded components
const LazyMobileSidebar = lazy(() => import("./sidebar-components/mobile-sidebar").then((mod) => ({ default: mod.MobileSidebar })))
const LazySearchResults = lazy(() => import("./sidebar-components/search-results").then((mod) => ({ default: mod.SearchResults })))

// Navigation Configuration
const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5 text-blue-500" /> },
  { title: "Smart Wallet", href: "/dashboard/wallet", icon: <Wallet className="h-5 w-5 text-purple-500" /> },
  { title: "Portfolio", href: "/dashboard/portfolio", icon: <LineChart className="h-5 w-5 text-green-500" />, badge: "Coming soon", badgeColor: "bg-white text-indigo-300" },
  { title: "Subscriptions", href: "/dashboard/subscriptions", icon: <Repeat className="h-5 w-5 text-orange-500" /> },
  { title: "Social Payments", href: "/dashboard/social", icon: <Users className="h-5 w-5 text-pink-500" /> },
  { title: "Token Swap", href: "/dashboard/swap", icon: <ArrowRightLeft className="h-5 w-5 text-indigo-500" /> },
  { title: "AI Education", href: "/dashboard/education", icon: <BookOpen className="h-5 w-5 text-cyan-500" />, badge: "Coming soon", badgeColor: "bg-white text-indigo-300" },
  { title: "Savings", href: "/dashboard/savings", icon: <PiggyBank className="h-5 w-5 text-rose-500" />, badge: "Coming soon", badgeColor: "bg-white text-indigo-300" },
  { title: "DeFi Yields", href: "/dashboard/defi", icon: <Coins className="h-5 w-5 text-amber-500" />, badge: "Coming soon", badgeColor: "bg-white text-indigo-300" },
]

// Mock useAuth hook
let useAuth: () => AuthHook;
try {
  useAuth = require('@/hooks/useAuth').useAuth;
} catch (error) {
  useAuth = (): AuthHook => ({
    user: { name: "Sarah Johnson" },
    address: "0x1234...5678",
    disconnect: () => {
      console.log("Disconnected");
      toast.success("Wallet disconnected", { description: "You have been successfully logged out" });
    },
  });
}

// Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Sidebar Error:', error, errorInfo);
    toast.error("An error occurred in the sidebar", { description: "Please try refreshing the page if the problem persists." });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center" role="alert">
          <p className="text-sm text-destructive font-medium">Failed to load component</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">{this.state.error?.message || "An unexpected error occurred."}</p>
          <Button variant="outline" size="sm" onClick={this.resetError} aria-label="Retry loading component">
            Retry
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Sidebar Context
const SidebarContext = React.createContext<SidebarContextType & { notificationCount: number }>({
  isCollapsed: false,
  toggleSidebar: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
  notificationCount: 0,
});

export const useSidebar = () => React.useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationCount] = useState(3);

  // Initialize preferences from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initializePreferences = () => {
      try {
        // Load sidebar state
        const savedSidebarState = localStorage.getItem("sidebarCollapsed");
        if (savedSidebarState !== null) {
          const parsedState = JSON.parse(savedSidebarState);
          if (typeof parsedState === "boolean") {
            setIsCollapsed(parsedState);
            document.documentElement.style.setProperty("--sidebar-width", parsedState ? "70px" : "280px");
          }
        } else {
          document.documentElement.style.setProperty("--sidebar-width", "280px");
        }

        // Load theme preference
        const savedThemeState = localStorage.getItem("darkMode");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = savedThemeState !== null ? 
          (typeof JSON.parse(savedThemeState) === "boolean" ? JSON.parse(savedThemeState) : prefersDark) : 
          prefersDark;
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle("dark", isDark);
      } catch (error) {
        console.error("Failed to load preferences:", error);
        document.documentElement.style.setProperty("--sidebar-width", "280px");
        document.documentElement.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
        toast.error("Failed to load preferences", { description: "Using default settings instead." });
      }
    };

    initializePreferences();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const savedThemeState = localStorage.getItem("darkMode");
      if (savedThemeState === null) {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      try {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
        document.documentElement.style.setProperty("--sidebar-width", newState ? "70px" : "280px");
      } catch (error) {
        console.error("Failed to save sidebar state:", error);
        toast.error("Failed to save sidebar preference", { description: "Your preference will be lost when you reload the page." });
      }
      return newState;
    });
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const newState = !prev;
      try {
        document.documentElement.classList.toggle("dark", newState);
        localStorage.setItem("darkMode", JSON.stringify(newState));
        toast.success(newState ? "Dark mode enabled" : "Light mode enabled", {
          description: newState ? "Switched to dark theme" : "Switched to light theme",
        });
      } catch (error) {
        console.error("Failed to save theme state:", error);
        toast.error("Failed to save theme preference", { description: "Your preference will be lost when you reload the page." });
      }
      return newState;
    });
  }, []);

  const contextValue = useMemo(
    () => ({ isCollapsed, toggleSidebar, isDarkMode, toggleDarkMode, notificationCount }),
    [isCollapsed, toggleSidebar, isDarkMode, toggleDarkMode, notificationCount]
  );

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
};

// Skeleton Loader
const SidebarSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="animate-pulse space-y-4 p-4" role="status" aria-label="Loading sidebar">
    <div className="h-8 w-3/4 bg-muted rounded"></div>
    <div className="space-y-2">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="h-10 bg-muted rounded"></div>
      ))}
    </div>
  </div>
);

// Animation Variants
const sidebarVariants = {
  expanded: { width: "280px", transition: { type: "spring", stiffness: 300, damping: 30 } },
  collapsed: { width: "70px", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0 },
  collapsed: { opacity: 0, x: -10 },
};

const badgeVariants = {
  expanded: { scale: 1, opacity: 1 },
  collapsed: { scale: 0, opacity: 0 },
};

// NavItem Component
const NavItem = React.memo(
  ({ 
    item, 
    showPin = true, 
    isPinned = false, 
    togglePinItem, 
    pathname, 
    isCollapsed 
  }: {
    item: NavItem;
    showPin?: boolean;
    isPinned?: boolean;
    togglePinItem?: (item: NavItem) => void;
    pathname: string;
    isCollapsed: boolean;
  }) => {
    const isActive = useMemo(() => {
      if (pathname === item.href) return true;
      if (item.href === "/dashboard" && pathname !== "/dashboard") return false;
      return !item.isExternal && pathname.startsWith(item.href);
    }, [pathname, item.href, item.isExternal]);

    const handlePinClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (togglePinItem) togglePinItem(item);
      },
      [item, togglePinItem]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!item.isDisabled && item.onClick) item.onClick();
        }
      },
      [item]
    );

    const handlePinKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          if (togglePinItem) togglePinItem(item);
        }
      },
      [item, togglePinItem]
    );

    const navItemContent = (
      <motion.div 
        whileHover={!item.isDisabled ? { scale: 1.02 } : {}} 
        whileTap={!item.isDisabled ? { scale: 0.98 } : {}} 
        className="flex items-center gap-3 w-full"
      >
        <motion.div className={cn("w-6 h-6 flex-shrink-0", item.isDisabled && "opacity-50")}>
          {item.icon}
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span 
              variants={itemVariants} 
              initial="collapsed" 
              animate="expanded" 
              exit="collapsed" 
              className={cn(
                "text-sm flex-1 font-medium truncate", 
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                item.isDisabled && "opacity-50"
              )}
            >
              {item.title}
              {item.isExternal && <ExternalLink className="ml-1 inline h-3 w-3" aria-hidden="true" />}
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
              "text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap", 
              item.badgeColor || "bg-muted text-muted-foreground"
            )}
          >
            {item.badge}
          </motion.span>
        )}
        {isActive && (
          <motion.div 
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary z-10"
            layoutId="activeNavIndicator"
          />
        )}
      </motion.div>
    );

    const navItemWrapper = () => {
      if (item.isDisabled) {
        return (
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 relative flex-grow opacity-50 cursor-not-allowed"
            )}
            aria-disabled={true}
          >
            {navItemContent}
          </div>
        );
      } else if (item.isExternal && item.href) {
        return (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-primary/10 relative flex-grow transition-colors",
              isActive ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
            onKeyDown={handleKeyDown}
          >
            {navItemContent}
          </a>
        );
      } else if (item.href) {
        return (
          <Link
            href={item.href}
            prefetch={true}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-primary/10 relative flex-grow transition-colors",
              isActive ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
            onKeyDown={handleKeyDown}
          >
            {navItemContent}
          </Link>
        );
      } else {
        return (
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-primary/10 relative flex-grow cursor-pointer transition-colors",
              isActive ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => item.onClick && item.onClick()}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
          >
            {navItemContent}
          </div>
        );
      }
    };

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="flex items-center relative group" 
              role="listitem"
            >
              {navItemWrapper()}
              {!isCollapsed && showPin && !item.isDisabled && togglePinItem && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handlePinClick}
                  onKeyDown={handlePinKeyDown}
                  className={cn(
                    "h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary/10 transition-opacity",
                    isPinned && "opacity-100"
                  )}
                  aria-label={isPinned ? `Unpin ${item.title}` : `Pin ${item.title}`}
                  aria-pressed={isPinned}
                >
                  <Pin 
                    className={cn("h-4 w-4 mr-4", isPinned && "fill-primary text-primary")} 
                    aria-hidden="true" 
                  />
                </Button>
              )}
            </div>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent 
              side="right" 
              className="flex items-center gap-2 bg-card border rounded-lg shadow-md z-50"
              sideOffset={5}
            >
              <span>{item.title}</span>
              {item.isExternal && <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />}
              {item.badge && (
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-medium", 
                  item.badgeColor || "bg-muted text-muted-foreground"
                )}>
                  {item.badge}
                </span>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }
);

NavItem.displayName = "NavItem";

// Sidebar Content Component
const SidebarContent = React.memo(
  ({ 
    pinnedItems, 
    togglePinItem, 
    searchQuery, 
    setSearchQuery, 
    showSearchResults, 
    setShowSearchResults,
    addToRecentPages,
    recentPages = [],
    isCollapsed,
    toggleSidebar
  }: {
    pinnedItems: NavItem[];
    togglePinItem: (item: NavItem) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    showSearchResults: boolean;
    setShowSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
    addToRecentPages?: (item: NavItem) => void;
    recentPages?: NavItem[];
    isCollapsed: boolean;
    toggleSidebar: () => void;
  }) => {
    const { isDarkMode, toggleDarkMode } = useSidebar();
    const pathname = usePathname();
    const { user, address, disconnect } = useAuth();
    const router = useRouter();

    const filteredItems = useMemo(() => {
      const searchTerm = searchQuery.toLowerCase().trim();
      if (!searchTerm) return [];
      return NAV_ITEMS.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        (item.badge && item.badge.toLowerCase().includes(searchTerm))
      );
    }, [searchQuery]);

    const categorizedNavItems = useMemo(() => {
      const pinnedHrefs = new Set(pinnedItems.map(item => item.href));
      const main = NAV_ITEMS.filter(item =>
        ["/dashboard", "/dashboard/wallet", "/dashboard/portfolio", "/dashboard/subscriptions", "/dashboard/social", "/dashboard/swap", "/dashboard/education"].includes(item.href)
        && !pinnedHrefs.has(item.href)
      );
      const finance = NAV_ITEMS.filter(item => 
        ["/dashboard/savings", "/dashboard/defi"].includes(item.href)
        && !pinnedHrefs.has(item.href)
      );
      const utility = NAV_ITEMS.filter(item => 
        ["/dashboard/settings", "/dashboard/help"].includes(item.href)
        && !pinnedHrefs.has(item.href)
      );
      return { main, finance, utility };
    }, [pinnedItems]);

    const debouncedSearch = useCallback(
      debounce((value: string) => {
        const sanitizedValue = value.replace(/[<>]/g, "").trim();
        setSearchQuery(sanitizedValue);
        setShowSearchResults(sanitizedValue.length > 0);
      }, 200),
      [setSearchQuery, setShowSearchResults]
    );

    useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
    }, [debouncedSearch]);

    const handleClearSearch = useCallback(() => {
      setSearchQuery('');
      setShowSearchResults(false);
    }, [setSearchQuery, setShowSearchResults]);

    const handleDisconnect = useCallback(() => {
      disconnect();
      router.push("/");
      toast.success("Successfully logged out", {
        description: "You have been redirected to the home page"
      });
    }, [disconnect, router]);

    return (
      <nav aria-label="Main sidebar navigation" className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-between px-3 border-b">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md" 
            aria-label="Go to Dashboard"
          >
            <AnimatePresence>
              {!isCollapsed && (
                 <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ duration: 0.6 }}
            className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent"
          >
            Bumblebee
          </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? 
                <ChevronRight className="h-4 w-4" aria-hidden="true" /> : 
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              }
            </Button>
          </div>
        </div>
        
        {/* Sidebar Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4" role="list">
           {/* Search Bar */}
{/* Search Bar */}
{!isCollapsed && (
  <div className="relative">
    <Search
      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
      aria-hidden="true"
    />
    <Input
      type="search"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => debouncedSearch(e.target.value)}
      className="pl-8 pr-8 text-sm w-60"
      aria-label="Search navigation"
      maxLength={100}
    />
    {searchQuery && (
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-primary/10 rounded-full"
        onClick={handleClearSearch}
        aria-label="Clear search"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </Button>
    )}
  </div>
)}            {/* Search Results or Main Navigation */}
            {showSearchResults ? (
              <Suspense fallback={<SidebarSkeleton count={3} />}>
                <ErrorBoundary>
                  <LazySearchResults
                    showSearchResults={showSearchResults}
                    filteredItems={filteredItems}
                    setShowSearchResults={setShowSearchResults}
                    addToRecentPages={addToRecentPages}
                    searchQuery={searchQuery}
                    onClearSearch={handleClearSearch}
                  />
                </ErrorBoundary>
              </Suspense>
            ) : (
              <>
                {/* Pinned Items */}
                {pinnedItems.length > 0 && (
                  <div className="space-y-1">
                    <h2 
                      className={cn(
                        "text-xs font-semibold text-muted-foreground uppercase", 
                        isCollapsed && "sr-only"
                      )} 
                      id="pinned-nav-heading"
                    >
                      Pinned
                    </h2>
                    <div role="list" aria-labelledby="pinned-nav-heading">
                      {pinnedItems.map((item) => (
                        <NavItem
                          key={`pinned-${item.href}`}
                          item={item}
                          showPin
                          isPinned={true}
                          togglePinItem={togglePinItem}
                          pathname={pathname}
                          isCollapsed={isCollapsed}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Recent Pages */}
                {recentPages.length > 0 && (
                  <div className="space-y-1">
                    <h2 
                      className={cn(
                        "text-xs font-semibold text-muted-foreground uppercase", 
                        isCollapsed && "sr-only"
                      )} 
                      id="recent-nav-heading"
                    >
                      Recent
                    </h2>
                    <div role="list" aria-labelledby="recent-nav-heading">
                      {recentPages.map((item) => (
                        <NavItem
                          key={`recent-${item.href}`}
                          item={item}
                          showPin={false}
                          pathname={pathname}
                          isCollapsed={isCollapsed}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Main Navigation */}
                {categorizedNavItems.main.length > 0 && (
                  <div className="space-y-1">
                    <h2 
                      className={cn(
                        "text-xs font-semibold text-muted-foreground uppercase", 
                        isCollapsed && "sr-only"
                      )} 
                      id="main-nav-heading"
                    >
                      Main
                    </h2>
                    <div role="list" aria-labelledby="main-nav-heading">
                      {categorizedNavItems.main.map((item) => (
                        <NavItem
                          key={`main-${item.href}`}
                          item={item}
                          togglePinItem={togglePinItem}
                          pathname={pathname}
                          isCollapsed={isCollapsed}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Finance Navigation */}
                {categorizedNavItems.finance.length > 0 && (
                  <div className="space-y-1">
                    <h2 
                      className={cn(
                        "text-xs font-semibold text-muted-foreground uppercase", 
                        isCollapsed && "sr-only"
                      )} 
                      id="finance-nav-heading"
                    >
                      Finance
                    </h2>
                    <div role="list" aria-labelledby="finance-nav-heading">
                      {categorizedNavItems.finance.map((item) => (
                        <NavItem
                          key={`finance-${item.href}`}
                          item={item}
                          togglePinItem={togglePinItem}
                          pathname={pathname}
                          isCollapsed={isCollapsed}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
        
        {/* Sidebar Footer */}
        <div className={cn(
          "border-t",
          isCollapsed ? "flex justify-center items-center py-4" : "p-4"
        )}>
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center gap-2" : "gap-3 px-3"
          )}>
            <div className={cn(
              "rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-medium",
              isCollapsed ? "h-7 w-7" : "h-8 w-8"
            )}>
              {user?.name?.[0] || "S"}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{address || "No address"}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDisconnect}
              className={cn(
                "h-8 w-8 rounded-full hover:bg-primary/10",
                isCollapsed && "ml-0"
              )}
              aria-label="Disconnect wallet"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </nav>
    );
  }
);

SidebarContent.displayName = "SidebarContent";

// Main Dashboard Sidebar Component
export const DashboardSidebar = React.memo(function DashboardSidebar({ 
  isCollapsed, 
  setIsCollapsed 
}: { 
  isCollapsed: boolean; 
  setIsCollapsed: (value: boolean) => void 
}) {
  // Memoized toggle sidebar handler
  const handleToggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed, setIsCollapsed]);

  // Memoized empty functions to prevent unnecessary re-renders
  const noop = useCallback(() => {}, []);
  const noopWithParam = useCallback((param: any) => {}, []);

  // Memoized sidebar content props
  const sidebarContentProps = useMemo(() => ({
    isCollapsed,
    toggleSidebar: handleToggleSidebar,
    pinnedItems: [] as NavItem[],
    togglePinItem: noopWithParam,
    searchQuery: "",
    setSearchQuery: noopWithParam,
    showSearchResults: false,
    setShowSearchResults: noop,
    recentPages: [] as NavItem[],
    addToRecentPages: noopWithParam
  }), [isCollapsed, handleToggleSidebar, noop, noopWithParam]);

  return (
    <motion.div
      className={cn(
        "hidden md:flex flex-col border-r bg-card h-screen shadow-md fixed left-0 z-30",
        "transition-all duration-300 ease-in-out"
      )}
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      style={{ width: isCollapsed ? '70px' : '280px' }}
      layoutId="sidebar"
    >
      <SidebarContent {...sidebarContentProps} />
    </motion.div>
  );
});