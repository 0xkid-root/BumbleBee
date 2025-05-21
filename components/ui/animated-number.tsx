"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface AnimatedNumberProps {
  value: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  formatOptions?: Intl.NumberFormatOptions
}

export function AnimatedNumber({
  value,
  duration = 1,
  delay = 0,
  prefix = "",
  suffix = "",
  formatOptions = {},
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const startTime = useRef<number | null>(null)
  const frameId = useRef<number | null>(null)

  useEffect(() => {
    if (!isInView) return

    // Clear any existing animation
    if (frameId.current) {
      cancelAnimationFrame(frameId.current)
    }

    // Delay the start of the animation if needed
    const timer = setTimeout(() => {
      startTime.current = null

      const animate = (timestamp: number) => {
        if (startTime.current === null) {
          startTime.current = timestamp
        }

        const elapsed = timestamp - startTime.current
        const progress = Math.min(elapsed / (duration * 1000), 1)

        // Easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)

        setDisplayValue(Math.floor(easeOutQuart * value))

        if (progress < 1) {
          frameId.current = requestAnimationFrame(animate)
        } else {
          setDisplayValue(value)
        }
      }

      frameId.current = requestAnimationFrame(animate)
    }, delay * 1000)

    return () => {
      clearTimeout(timer)
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
    }
  }, [value, duration, delay, isInView])

  const formattedValue = new Intl.NumberFormat(undefined, formatOptions).format(displayValue)

  return (
    <span ref={ref}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
