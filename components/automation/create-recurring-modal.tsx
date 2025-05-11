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
import { CalendarIcon, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

type RecurringFormState = {
  name: string
  description: string
  amount: string
  token: string
  recipient: string
  frequency: string
  startDate: Date | undefined
}

const initialFormState: RecurringFormState = {
  name: "",
  description: "",
  amount: "",
  token: "",
  recipient: "",
  frequency: "",
  startDate: undefined
}

export function CreateRecurringModal() {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<RecurringFormState>(initialFormState)
  const { addRecurringTransaction } = useAutomationStore()

  const handleInputChange = (field: keyof RecurringFormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formState.startDate) return
    
    // Calculate next payment date based on frequency and start date
    const startDate = formState.startDate
    let nextPaymentDate = new Date(startDate)
    
    // For demo purposes, we'll set the next payment date based on frequency
    switch (formState.frequency) {
      case "daily":
        nextPaymentDate.setDate(startDate.getDate() + 1)
        break
      case "weekly":
        nextPaymentDate.setDate(startDate.getDate() + 7)
        break
      case "bi-weekly":
        nextPaymentDate.setDate(startDate.getDate() + 14)
        break
      case "monthly":
        nextPaymentDate.setMonth(startDate.getMonth() + 1)
        break
      case "quarterly":
        nextPaymentDate.setMonth(startDate.getMonth() + 3)
        break
      case "yearly":
        nextPaymentDate.setFullYear(startDate.getFullYear() + 1)
        break
      default:
        nextPaymentDate.setMonth(startDate.getMonth() + 1)
    }
    
    // Add the new recurring transaction
    addRecurringTransaction({
      id: crypto.randomUUID(),
      name: formState.name,
      description: formState.description,
      amount: parseFloat(formState.amount),
      token: formState.token,
      recipient: formState.recipient,
      frequency: formState.frequency,
      status: "active",
      startDate: startDate.toISOString(),
      nextPaymentDate: nextPaymentDate.toISOString(),
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
          <Plus className="h-4 w-4" /> Create Recurring Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Recurring Payment</DialogTitle>
          <DialogDescription>
            Set up a new automated recurring payment or subscription.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Payment Name</Label>
            <Input 
              id="name" 
              value={formState.name} 
              onChange={(e) => handleInputChange("name", e.target.value)} 
              placeholder="Netflix Subscription"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formState.description} 
              onChange={(e) => handleInputChange("description", e.target.value)} 
              placeholder="Brief description of this payment"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number"
                step="0.01"
                min="0"
                value={formState.amount} 
                onChange={(e) => handleInputChange("amount", e.target.value)} 
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <Select 
                value={formState.token} 
                onValueChange={(value) => handleInputChange("token", value)}
                required
              >
                <SelectTrigger id="token">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                  <SelectItem value="MATIC">MATIC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input 
              id="recipient" 
              value={formState.recipient} 
              onChange={(e) => handleInputChange("recipient", e.target.value)} 
              placeholder="0x..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select 
              value={formState.frequency} 
              onValueChange={(value) => handleInputChange("frequency", value)}
              required
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formState.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formState.startDate ? (
                    format(formState.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formState.startDate}
                  onSelect={(date) => handleInputChange("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formState.startDate}
            >
              Create Recurring Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
