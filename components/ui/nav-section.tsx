import { motion } from "framer-motion"
import type { NavItem } from "@/types/sidebar"
import { cn } from "@/lib/utils"
import { NavItem as NavItemComponent } from "@/components/ui/nav-item"

interface NavSectionProps {
  title: string
  items: NavItem[]
  isCollapsed: boolean
}

export function NavSection({ title, items, isCollapsed }: NavSectionProps) {
  return (
    <div className="space-y-2">
      {!isCollapsed && (
        <h3 className="px-2 text-xs font-medium text-muted-foreground">
          {title}
        </h3>
      {items.map((item) => (
        <NavItemComponent key={item.href} item={item} isCollapsed={isCollapsed} />
      ))}
      ))}
    </div>
  )
}

export function NavSectionSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-24 rounded bg-muted animate-pulse" />
      <div className="space-y-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-9 rounded bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  )
}