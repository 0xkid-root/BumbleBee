"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface SectionTitleProps {
  title: string
  subtitle?: string
  titleClassName?: string
  subtitleClassName?: string
  className?: string
}

export function SectionTitle({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h2 className={cn("text-2xl font-semibold tracking-tight", titleClassName)}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-sm text-muted-foreground", subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
