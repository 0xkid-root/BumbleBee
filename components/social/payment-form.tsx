"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useSocialPaymentsStore } from "@/lib/store/use-social-payments-store"
import { Loader2, Send, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Contact, Group } from "@/lib/store/use-social-payments-store"

type PaymentFormProps = {
  isOpen?: boolean
  onClose?: () => void
  contactId?: string | null
  onSubmit?: () => void
  recipient?: Contact
  group?: Group
}

export function PaymentForm({ isOpen, onClose, contactId, onSubmit, recipient, group }: PaymentFormProps) {
  const { contacts, addActivity } = useSocialPaymentsStore()
  const [activeTab, setActiveTab] = useState<"pay" | "request">("pay")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const contact = recipient || (contactId ? contacts.find((c) => c.id === contactId) : null)

  const handleSubmit = async () => {
    if (!contact) return

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      addActivity({
        type: activeTab === "pay" ? "payment" : "request",
        user: {
          id: "me",
          name: "You",
          avatar: "/avatars/woman-1.png",
        },
        recipient: {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
        },
        amount: Number.parseFloat(amount),
        note: note || `Payment to ${contact.name}`,
        timestamp: new Date().toISOString(),
        status: activeTab === "pay" ? "completed" : "pending",
      })

      if (activeTab === "pay") {
        toast({
          title: "Payment sent",
          description: `You sent $${amount} to ${contact.name}`,
        })
      } else {
        addActivity({
          type: "request",
          user: {
            id: contact.id,
            name: contact.name,
            avatar: contact.avatar,
          },
          recipient: {
            id: "me",
            name: "You",
            avatar: "/avatars/woman-1.png",
          },
          amount: Number.parseFloat(amount),
          note: note || `Request from you`,
          timestamp: new Date().toISOString(),
          status: "pending",
        })

        toast({
          title: "Request sent",
          description: `You requested $${amount} from ${contact.name}`,
        })
      }

      handleClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setAmount("")
    setNote("")
    setActiveTab("pay")
    if (onSubmit) {
      onSubmit()
    }
    
    if (onClose) {
      onClose()
    }
  }

  if (!contact) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
              <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {activeTab === "pay" ? "Pay" : "Request from"} {contact.name}
          </DialogTitle>
          <DialogDescription>
            {activeTab === "pay" ? "Send money to your contact" : "Request money from your contact"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pay" value={activeTab} onValueChange={(value) => setActiveTab(value as "pay" | "request")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pay">Pay</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder={`What's this ${activeTab === "pay" ? "payment" : "request"} for?`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {activeTab === "pay" && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Payment Method</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Wallet Balance</span>
                <span>$1,234.56</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {activeTab === "pay" ? "Sending..." : "Requesting..."}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {activeTab === "pay" ? "Send Money" : "Request Money"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
