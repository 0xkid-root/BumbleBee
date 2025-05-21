"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { AssetAllocation } from "@/lib/store/use-portfolio-store"
import { cn } from "@/lib/utils"

type AllocationChartProps = {
  allocation: AssetAllocation[]
  className?: string
}

export function AllocationChart({ allocation = [], className }: AllocationChartProps) {
  // Add a safety check
  if (!allocation || allocation.length === 0) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Distribution of your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center text-muted-foreground">No allocation data available</div>
        </CardContent>
      </Card>
    )
  }

  // Calculate total value
  const totalValue = allocation.reduce((sum, asset) => sum + asset.value, 0)

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <div className="font-medium">{data.name}</div>
          <div className="text-sm text-muted-foreground">{data.symbol}</div>
          <div className="mt-1 font-medium">${data.value.toLocaleString()}</div>
          <div className="text-sm">{data.percentage.toFixed(1)}% of portfolio</div>
        </div>
      )
    }

    return null
  }

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <div className="text-sm truncate">{entry.value}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Distribution of your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {allocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="text-center mt-auto">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
