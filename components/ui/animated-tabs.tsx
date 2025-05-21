"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnimatedTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  items: {
    value: string
    label: string
    icon?: React.ReactNode
  }[]
  defaultValue?: string
}

export function AnimatedTabs({ className, items, defaultValue, ...props }: AnimatedTabsProps) {
  return (
    <Tabs defaultValue={defaultValue || items[0]?.value} className={className} {...props}>
      <TabsList className="relative">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="relative z-10 flex items-center gap-2 data-[state=active]:text-foreground"
          >
            {item.icon}
            {item.label}
            {item.value === (defaultValue || items[0]?.value) && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 z-0 rounded-md bg-background"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {props.children}
    </Tabs>
  )
}
