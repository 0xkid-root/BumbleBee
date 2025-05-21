import { motion } from "framer-motion"
import { useSidebar } from "@/components/providers/sidebar-provider"
import { cn } from "@/lib/utils"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <motion.main
      className={cn(
        "flex-1 h-screen overflow-y-auto",
        "transition-all duration-300 ease-in-out"
      )}
      initial={false}
      animate={{
        marginLeft: isCollapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </motion.main>
  )
}