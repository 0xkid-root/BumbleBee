"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface AnimatedListProps {
  items: React.ReactNode[]
  staggerDelay?: number
  animationType?: "fade" | "fadeSlide" | "scale" | "none"
  className?: string
}

export function AnimatedList({ items, staggerDelay = 0.1, animationType = "fade", className }: AnimatedListProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const getAnimationVariants = () => {
    switch (animationType) {
      case "fadeSlide":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        }
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
      case "none":
      default:
        return {
          hidden: {},
          visible: {},
        }
    }
  }

  const variants = getAnimationVariants()

  return (
    <div ref={ref} className={className}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={variants}
          transition={{
            duration: 0.4,
            delay: isInView ? index * staggerDelay : 0,
            ease: "easeOut",
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  )
}
