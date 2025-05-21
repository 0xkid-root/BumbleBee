"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface AnimatedProgressProps {
  value: number
  delay?: number
  duration?: number
  className?: string
  indicatorClassName?: string
}

export function AnimatedProgress({
  value,
  delay = 0,
  duration = 1,
  className,
  indicatorClassName,
}: AnimatedProgressProps) {
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    const timer = setTimeout(() => {
      const start = 0
      const end = Math.min(100, Math.max(0, value))
      const startTime = performance.now()
      const endTime = startTime + duration * 1000

      const animateProgress = (currentTime: number) => {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / (duration * 1000), 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease out

        const currentProgress = start + easeProgress * (end - start)
        setProgress(currentProgress)

        if (currentTime < endTime) {
          requestAnimationFrame(animateProgress)
        } else {
          setProgress(end)
        }
      }

      requestAnimationFrame(animateProgress)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [value, delay, duration, isInView])

  return (
    <div ref={ref}>
      <Progress value={progress} className={className} indicatorClassName={indicatorClassName} />
    </div>
  )
}
