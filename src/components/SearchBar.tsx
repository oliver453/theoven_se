'use client'

import { MagnifyingGlass } from '@/components/icons/icons'
import { useState } from 'react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = "Sök efter artiklar..." }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    // Optional: debounced search
    if (onSearch && e.target.value.length > 2) {
      onSearch(e.target.value)
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="search-input w-full pl-12 pr-4 py-4 bg-background rounded-lg border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-lg text-foreground placeholder:text-foreground/50"
          />
        </div>
      </form>
    </div>
  )
}