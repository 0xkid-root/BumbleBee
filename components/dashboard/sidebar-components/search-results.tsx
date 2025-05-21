"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavItem, SearchResultsProps } from "../sidebar-types"

// Using the SearchResultsProps interface imported from sidebar-types.ts

export const SearchResults: React.FC<SearchResultsProps> = ({
  showSearchResults,
  filteredItems,
  setShowSearchResults,
  addToRecentPages
}) => {
  return (
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
              item.isExternal ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                  onClick={() => {
                    setShowSearchResults(false)
                    if (item.onClick) {
                      item.onClick()
                    }
                  }}
                >
                  <span className="flex h-6 w-6 items-center justify-center text-primary">{item.icon}</span>
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className={cn("ml-auto text-xs px-1.5 py-0.5 rounded-full", item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                  onClick={() => {
                    setShowSearchResults(false)
                    if (addToRecentPages && !item.isDisabled) {
                      addToRecentPages(item)
                    }
                    if (item.onClick) {
                      item.onClick()
                    }
                  }}
                >
                  <span className="flex h-6 w-6 items-center justify-center text-primary">{item.icon}</span>
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className={cn("ml-auto text-xs px-1.5 py-0.5 rounded-full", item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
