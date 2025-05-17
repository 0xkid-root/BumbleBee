"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { NavItem as NavItemType } from "@/types/sidebar"

interface NavItemProps {
  item: NavItemType
  isCollapsed: boolean
}

export function NavItem({ item, isCollapsed }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50 hover:text-accent-foreground"
      )}
    >
      {item.icon && (
        <span className="flex-shrink-0">
          {React.createElement(item.icon)}
        </span>
      )}
      {!isCollapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </Link>
  )
}