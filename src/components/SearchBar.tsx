'use client'

import { MagnifyingGlass } from '@/components/icons/icons'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/lib/sanity'
import { queries } from '@/lib/sanity/queries'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  showSuggestions?: boolean
}

interface SearchSuggestion {
  articles: Array<{ title: string; slug: { current: string } }>
  categories: Array<{ title: string; slug: { current: string } }>
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search for articles...",
  showSuggestions = true 
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [suggestions, setSuggestions] = useState<SearchSuggestion>({ articles: [], categories: [] })
  const [showSuggestionsList, setShowSuggestionsList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = async (searchTerm: string) => {
    if (!showSuggestions || searchTerm.length < 2) {
      setSuggestions({ articles: [], categories: [] })
      setShowSuggestionsList(false)
      return
    }

    setIsLoading(true)
    try {
      const results = await client.fetch(queries.searchSuggestions, { searchTerm })
      setSuggestions(results || { articles: [], categories: [] })
      setShowSuggestionsList(true)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions({ articles: [], categories: [] })
    }
    setIsLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setShowSuggestionsList(false)
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    
    // Debounce suggestions
    const timeoutId = setTimeout(() => {
      fetchSuggestions(newQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any)
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
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input w-full pl-12 pr-4 py-4 bg-background rounded-lg border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-lg text-foreground placeholder:text-foreground/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
            >
              ✕
            </button>
          )}
        </div>
      </form>
    </div>
  )
}