"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

type FilterState = {
  type: string
  status: string
  dateRange: string
  asset: string
}

type TransactionFilterProps = {
  filter: FilterState
  setFilter: (filter: FilterState) => void
}

export function TransactionFilter({ filter, setFilter }: TransactionFilterProps) {
  const handleTypeChange = (value: string) => {
    setFilter({ ...filter, type: value })
  }

  const handleStatusChange = (value: string) => {
    setFilter({ ...filter, status: value })
  }

  const handleDateRangeChange = (value: string) => {
    setFilter({ ...filter, dateRange: value })
  }

  const handleAssetChange = (value: string) => {
    setFilter({ ...filter, asset: value })
  }

  const handleReset = () => {
    setFilter({
      type: "all",
      status: "all",
      dateRange: "all",
      asset: "all",
    })
  }

  const isFiltered =
    filter.type !== "all" || filter.status !== "all" || filter.dateRange !== "all" || filter.asset !== "all"

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
            {isFiltered && <span className="ml-1 rounded-full bg-primary w-2 h-2" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Transaction Type</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={filter.type} onValueChange={handleTypeChange}>
            <DropdownMenuRadioItem value="all">All Types</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="send">Send</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="receive">Receive</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="swap">Swap</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={filter.status} onValueChange={handleStatusChange}>
            <DropdownMenuRadioItem value="all">All Statuses</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="failed">Failed</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Date Range</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={filter.dateRange} onValueChange={handleDateRangeChange}>
            <DropdownMenuRadioItem value="all">All Time</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="week">This Week</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="month">This Month</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="year">This Year</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Asset</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={filter.asset} onValueChange={handleAssetChange}>
            <DropdownMenuRadioItem value="all">All Assets</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ETH">ETH</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="USDC">USDC</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="USDT">USDT</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="BTC">BTC</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          {isFiltered && (
            <Button variant="ghost" size="sm" className="w-full justify-center mt-2" onClick={handleReset}>
              Reset Filters
            </Button>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
