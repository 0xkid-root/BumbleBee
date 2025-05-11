"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, ArrowRight } from "lucide-react"
import type { useSocialPaymentsStore } from "@/lib/store/use-social-payments-store"

type GroupsListProps = {
  groups: ReturnType<typeof useSocialPaymentsStore>["groups"]
  onGroupSelect?: (groupId: string) => void
}

export function GroupsList({ groups, onGroupSelect }: GroupsListProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-1">No groups yet</h3>
        <p className="text-sm text-muted-foreground">Create a group to split expenses with friends</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.id} className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{group.name}</div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => onGroupSelect && onGroupSelect(group.id)}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">View group</span>
              </Button>
            </div>

            <div className="text-xs text-muted-foreground mb-3">{group.description}</div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {group.members.slice(0, 3).map((member, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-[10px]">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
                {group.members.length > 3 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                    +{group.members.length - 3}
                  </div>
                )}
              </div>

              <div className="text-xs">
                {group.balance >= 0 ? (
                  <span className="text-green-600">You're owed ${group.balance}</span>
                ) : (
                  <span className="text-red-600">You owe ${Math.abs(group.balance)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
