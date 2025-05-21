"use client"
import { useAutomationStore } from "@/lib/store/use-automation-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, AlertTriangle, Zap, ArrowRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type StrategyCardProps = {
  strategy: ReturnType<typeof useAutomationStore>["strategies"][0]
}

export function StrategyCard({ strategy }: StrategyCardProps) {
  const { updateStrategyStatus, deleteStrategy } = useAutomationStore()
  
  const handleStatusChange = (checked: boolean) => {
    updateStrategyStatus(strategy.id, checked ? "active" : "paused")
  }
  
  const handleDelete = () => {
    deleteStrategy(strategy.id)
  }
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{strategy.name}</CardTitle>
            <CardDescription className="text-sm mt-1">{strategy.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={strategy.status === "active" ? "success" : "secondary"}>
            {strategy.status === "active" ? "Active" : "Paused"}
          </Badge>
          <Badge variant="outline">{strategy.type}</Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Trigger:</span>
            <span className="text-sm">{strategy.trigger}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Action:</span>
            <span className="text-sm">{strategy.action}</span>
          </div>
          {strategy.conditions && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Conditions:</span>
              <span className="text-sm">{strategy.conditions}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <Switch 
            checked={strategy.status === "active"}
            onCheckedChange={handleStatusChange}
            id={`strategy-status-${strategy.id}`}
          />
          <label 
            htmlFor={`strategy-status-${strategy.id}`}
            className="text-sm font-medium cursor-pointer"
          >
            {strategy.status === "active" ? "Enabled" : "Disabled"}
          </label>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          Details <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
