import { Search } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

export function SearchInput({ 
  value, 
  onChange,
  className 
}: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="pl-9"
      />
    </div>
  )
}

export function SearchInputSkeleton() {
  return <div className="h-9 w-full rounded-md bg-muted animate-pulse" />
}