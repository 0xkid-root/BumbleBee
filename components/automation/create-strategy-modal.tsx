"use client"

import { useState } from "react"
import { useAutomationStore } from "@/lib/store/use-automation-store"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

type StrategyFormState = {
  name: string
  description: string
  type: string
  trigger: string
  action: string
  conditions: string
}

const initialFormState: StrategyFormState = {
  name: "",
  description: "",
  type: "",
  trigger: "",
  action: "",
  conditions: ""
}

export function CreateStrategyModal() {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<StrategyFormState>(initialFormState)
  const { addStrategy } = useAutomationStore()

  const handleInputChange = (field: keyof StrategyFormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Add the new strategy
    addStrategy({
      id: crypto.randomUUID(),
      name: formState.name,
      description: formState.description,
      type: formState.type,
      trigger: formState.trigger,
      action: formState.action,
      conditions: formState.conditions,
      status: "active",
      createdAt: new Date().toISOString()
    })
    
    // Reset form and close modal
    setFormState(initialFormState)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Strategy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Automation Strategy</DialogTitle>
          <DialogDescription>
            Set up a new automated strategy for your portfolio.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name</Label>
            <Input 
              id="name" 
              value={formState.name} 
              onChange={(e) => handleInputChange("name", e.target.value)} 
              placeholder="Price Alert Strategy"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formState.description} 
              onChange={(e) => handleInputChange("description", e.target.value)} 
              placeholder="Brief description of what this strategy does"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Strategy Type</Label>
            <Select 
              value={formState.type} 
              onValueChange={(value) => handleInputChange("type", value)}
              required
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select strategy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-alert">Price Alert</SelectItem>
                <SelectItem value="auto-buy">Auto Buy</SelectItem>
                <SelectItem value="auto-sell">Auto Sell</SelectItem>
                <SelectItem value="rebalance">Portfolio Rebalance</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trigger">Trigger</Label>
            <Select 
              value={formState.trigger} 
              onValueChange={(value) => handleInputChange("trigger", value)}
              required
            >
              <SelectTrigger id="trigger">
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-above">Price Above Threshold</SelectItem>
                <SelectItem value="price-below">Price Below Threshold</SelectItem>
                <SelectItem value="price-change">Price Change %</SelectItem>
                <SelectItem value="volume-spike">Volume Spike</SelectItem>
                <SelectItem value="market-event">Market Event</SelectItem>
                <SelectItem value="time-based">Time Based</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select 
              value={formState.action} 
              onValueChange={(value) => handleInputChange("action", value)}
              required
            >
              <SelectTrigger id="action">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy Asset</SelectItem>
                <SelectItem value="sell">Sell Asset</SelectItem>
                <SelectItem value="swap">Swap Assets</SelectItem>
                <SelectItem value="notification">Send Notification</SelectItem>
                <SelectItem value="rebalance">Rebalance Portfolio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="conditions">Conditions (Optional)</Label>
            <Textarea 
              id="conditions" 
              value={formState.conditions} 
              onChange={(e) => handleInputChange("conditions", e.target.value)} 
              placeholder="Additional conditions for this strategy"
              rows={2}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Strategy</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
