"use client"

import { useState, useEffect } from "react"

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs")
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Set initial width
    setWidth(window.innerWidth)

    // Update breakpoint based on width
    const updateBreakpoint = () => {
      const width = window.innerWidth
      setWidth(width)

      if (width >= breakpoints["2xl"]) {
        setBreakpoint("2xl")
      } else if (width >= breakpoints.xl) {
        setBreakpoint("xl")
      } else if (width >= breakpoints.lg) {
        setBreakpoint("lg")
      } else if (width >= breakpoints.md) {
        setBreakpoint("md")
      } else if (width >= breakpoints.sm) {
        setBreakpoint("sm")
      } else {
        setBreakpoint("xs")
      }
    }

    // Initial call
    updateBreakpoint()

    // Add event listener
    window.addEventListener("resize", updateBreakpoint)

    // Cleanup
    return () => window.removeEventListener("resize", updateBreakpoint)
  }, [])

  return { breakpoint, width, breakpoints }
}
