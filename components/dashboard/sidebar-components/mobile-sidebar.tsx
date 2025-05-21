"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { MobileSidebarProps } from "../sidebar-types"

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  overlayVariants,
  mobileMenuVariants,
  SidebarContent
}) => {
  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black z-30 md:hidden pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-y-0 left-0 w-[280px] bg-card border-r z-40 md:hidden"
          >
            <div className="absolute right-2 top-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-primary/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      <MobileToggle setIsMobileMenuOpen={setIsMobileMenuOpen} />
    </>
  )
}

const MobileToggle = ({ setIsMobileMenuOpen }: { setIsMobileMenuOpen: (open: boolean) => void }) => (
  <Button
    variant="ghost"
    size="icon"
    className="md:hidden fixed bottom-4 right-4 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg z-50 hover:bg-primary/90"
    onClick={() => setIsMobileMenuOpen(true)}
  >
    <LayoutDashboard className="h-5 w-5" />
  </Button>
)
