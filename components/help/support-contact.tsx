"use client"
import { Mail, MessageSquare, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function SupportContact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
        <CardDescription>Get help from our support team. We typically respond within 24 hours.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <MessageSquare className="mb-2 h-8 w-8 text-amber-500" />
              <h3 className="text-center text-lg font-medium">Live Chat</h3>
              <p className="text-center text-sm text-muted-foreground">Chat with our support team in real-time</p>
              <Button variant="outline" className="mt-4 w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Mail className="mb-2 h-8 w-8 text-amber-500" />
              <h3 className="text-center text-lg font-medium">Email Support</h3>
              <p className="text-center text-sm text-muted-foreground">support@bumblebee.finance</p>
              <Button variant="outline" className="mt-4 w-full">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Phone className="mb-2 h-8 w-8 text-amber-500" />
              <h3 className="text-center text-lg font-medium">Phone Support</h3>
              <p className="text-center text-sm text-muted-foreground">Premium users only</p>
              <Button variant="outline" className="mt-4 w-full">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Select>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account Issues</SelectItem>
                <SelectItem value="wallet">Wallet Connection</SelectItem>
                <SelectItem value="transaction">Transaction Problems</SelectItem>
                <SelectItem value="automation">Automation Strategies</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Your email address" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Describe your issue in detail" className="min-h-[120px]" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="attachment">Attachment (optional)</Label>
            <Input id="attachment" type="file" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Submit Support Request</Button>
      </CardFooter>
    </Card>
  )
}
