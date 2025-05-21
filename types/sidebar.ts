export interface NavItem {
  href: string
  icon: React.ComponentType
  label: string
  badge?: string
  isDisabled?: boolean
  isExternal?: boolean
}

export interface SearchResultsProps {
  showSearchResults: boolean
  filteredItems: NavItem[]
  setShowSearchResults: React.Dispatch<React.SetStateAction<boolean>>
  addToRecentPages?: (item: NavItem) => void
  onClearSearch: () => void
  searchQuery: string
}