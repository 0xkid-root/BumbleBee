import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { NavItem as NavItemType } from "@/types/sidebar";

interface NavItemProps {
  item: NavItemType;
  isActive?: boolean;
  isCollapsed: boolean;
}

const itemVariants = {
  collapsed: { opacity: 0, width: 0 },
  expanded: { opacity: 1, width: "auto" }
};

export const NavItem = React.memo(({ 
  item, 
  isActive = false, 
  isCollapsed 
}: NavItemProps) => {
  return (
    <motion.div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: "0.375rem",
        transition: "background-color 0.2s ease",
        backgroundColor: isActive ? "var(--accent)" : undefined
      }}
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      whileHover={{ backgroundColor: "var(--accent-50)" }}
      whileTap={{ backgroundColor: "var(--accent)" }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "0.5rem 0.75rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: isActive 
                ? "var(--foreground)" 
                : "var(--muted-foreground)"
            }}
          >
            <span style={{ height: "1.25rem", width: "1.25rem", flexShrink: 0 }}>
              <item.icon />
            </span>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  variants={itemVariants}
                  style={{
                    marginLeft: "0.75rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </TooltipTrigger>
        <TooltipContent sideOffset={5}>
          {item.label}
        </TooltipContent>
      </Tooltip>
      {isActive && (
        <motion.div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            height: "2rem",
            width: "0.25rem",
            transform: "translateY(-50%)",
            backgroundColor: "var(--primary)",
            borderTopRightRadius: "9999px",
            borderBottomRightRadius: "9999px"
          }}
          layoutId="activeNavIndicator"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />
      )}
    </motion.div>
  )
})