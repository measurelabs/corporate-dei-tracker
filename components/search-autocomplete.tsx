'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Building2 } from 'lucide-react'
import { api, Company } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatIndustry } from '@/lib/utils'

interface SearchAutocompleteProps {
  placeholder?: string
  className?: string
  onSelect?: (company: Company) => void
}

export function SearchAutocomplete({ placeholder = "Search companies...", className, onSelect }: SearchAutocompleteProps) {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState<Company[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim().length >= 2) {
        fetchSuggestions(searchInput)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = async (query: string) => {
    try {
      setIsLoading(true)
      const results = await api.autocompleteCompanies(query, 10)
      setSuggestions(results)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Autocomplete error:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/companies?search=${encodeURIComponent(searchInput)}`)
      setShowSuggestions(false)
    }
  }

  const handleSelectCompany = (company: Company) => {
    if (onSelect) {
      onSelect(company)
    } else {
      router.push(`/companies/${company.id}`)
    }
    setSearchInput('')
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectCompany(suggestions[selectedIndex])
        } else {
          handleSearch(e)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 h-5 sm:h-6 w-5 sm:w-6 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true)
            }}
            className="h-14 sm:h-16 pl-10 sm:pl-14 pr-24 sm:pr-32 text-base sm:text-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-300 dark:border-gray-700 transition-all rounded-lg font-medium"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="lg"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 sm:h-12 px-4 sm:px-8 text-sm sm:text-base font-semibold rounded-md bg-gray-800/95 dark:bg-gray-700/95 hover:opacity-90 backdrop-blur-sm text-white border-0"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {suggestions.map((company, index) => (
              <button
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className={`w-full px-4 py-3 text-left hover:text-foreground transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                  index === selectedIndex ? 'bg-gray-50 dark:bg-gray-800' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                    <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {company.name}
                      </span>
                      {company.ticker && (
                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded shrink-0">
                          {company.ticker}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="truncate">{formatIndustry(company.industry)}</span>
                      {company.hq_city && company.hq_country && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="truncate">{company.hq_city}, {company.hq_country}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-800">
              Loading...
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && !isLoading && searchInput.trim().length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No companies found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  )
}
