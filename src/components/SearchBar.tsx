import { Suspense } from 'react'
import { MagnifyingGlass } from '@/components/icons/icons'
import SearchBarCore from './SearchBarCore'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  showSuggestions?: boolean
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
          <div className="w-full pl-12 pr-12 py-4 bg-background rounded-lg border border-foreground/20 text-lg">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    }>
      <SearchBarCore {...props} />
    </Suspense>
  )
}