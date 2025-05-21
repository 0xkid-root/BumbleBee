import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { cn } from "@/lib/utils"

// Define User type inline to avoid import errors
interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  address?: string;
  walletAddress?: string;
}

interface UserProfileProps {
  user: User | null
  isCollapsed: boolean
}

export function UserProfile({ user, isCollapsed }: UserProfileProps) {
  if (!user) return null

  return (
    <div className={cn(
      "flex items-center gap-3 p-2",
      "rounded-lg transition-colors",
      "hover:bg-accent/50"
    )}>
      <Avatar>
        <AvatarImage src={user.image ?? ""} />
        <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className="flex flex-col">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user.address}
          </p>
        </div>
      )}
    </div>
  )
}

export function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      <div className="space-y-1">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        <div className="h-3 w-32 rounded bg-muted animate-pulse" />
      </div>
    </div>
  )
}