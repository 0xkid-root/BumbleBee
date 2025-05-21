import dynamic from 'next/dynamic'
import type { SearchResultsProps } from '@/types/sidebar'
import { SearchInputSkeleton } from '@/components/ui/search-input'
import { NavSectionSkeleton } from '@/components/ui/nav-section'
import { UserProfileSkeleton } from '@/components/ui/user-profile'

export const LazySearchInput = dynamic(() => 
  import('@/components/ui/search-input').then(mod => mod.SearchInput), {
    loading: () => <SearchInputSkeleton />,
    ssr: false
})

export const LazyNavSection = dynamic(() => 
  import('@/components/ui/nav-section').then(mod => mod.NavSection), {
    loading: () => <NavSectionSkeleton />,
    ssr: false
})

export const LazyUserProfile = dynamic(() => 
  import('@/components/ui/user-profile').then(mod => mod.UserProfile), {
    loading: () => <UserProfileSkeleton />,
    ssr: false
})