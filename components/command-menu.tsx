'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Building2, X } from 'lucide-react'
import { api, Company } from '@/lib/api'
import { cn, formatIndustry } from '@/lib/utils'

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Search companies
  useEffect(() => {
    const searchCompanies = async () => {
      if (!search.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        // Single API call - get more results to filter client-side
        const response = await api.getCompanies(1, 100, '')
        const allCompanies = response.data || []

        // Client-side filtering for name, ticker, and industry
        const searchLower = search.toLowerCase()
        const filteredResults = allCompanies.filter(company => {
          const nameMatch = company.name?.toLowerCase().includes(searchLower)
          const tickerMatch = company.ticker?.toLowerCase().includes(searchLower)
          const industryMatch = company.industry?.toLowerCase().replace(/_/g, ' ').includes(searchLower)

          return nameMatch || tickerMatch || industryMatch
        })

        // Sort results: exact name matches first, then ticker matches, then industry matches
        const sortedResults = filteredResults.sort((a, b) => {
          const aNameExact = a.name?.toLowerCase() === searchLower
          const bNameExact = b.name?.toLowerCase() === searchLower
          if (aNameExact && !bNameExact) return -1
          if (!aNameExact && bNameExact) return 1

          const aNameMatch = a.name?.toLowerCase().includes(searchLower)
          const bNameMatch = b.name?.toLowerCase().includes(searchLower)
          if (aNameMatch && !bNameMatch) return -1
          if (!aNameMatch && bNameMatch) return 1

          const aTickerMatch = a.ticker?.toLowerCase().includes(searchLower)
          const bTickerMatch = b.ticker?.toLowerCase().includes(searchLower)
          if (aTickerMatch && !bTickerMatch) return -1
          if (!aTickerMatch && bTickerMatch) return 1

          return 0
        })

        setResults(sortedResults.slice(0, 10))
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchCompanies, 200)
    return () => clearTimeout(debounce)
  }, [search])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) return

    if (e.key === 'Escape') {
      onOpenChange(false)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    }

    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault()
      const selected = results[selectedIndex]
      if (selected) {
        router.push(`/companies/${selected.id}`)
        onOpenChange(false)
      }
    }
  }, [open, results, selectedIndex, router, onOpenChange])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Reset state when menu closes
  useEffect(() => {
    if (!open) {
      setSearch('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Command Menu */}
      <div className="fixed left-1/2 top-[20vh] -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by name or ticker..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {search ? 'No companies found' : 'Start typing to search companies'}
              </div>
            ) : (
              <div className="py-2">
                {results.map((company, index) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      router.push(`/companies/${company.id}`)
                      onOpenChange(false)
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                      index === selectedIndex
                        ? 'bg-accent'
                        : 'hover:bg-accent/50'
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{company.name}</p>
                      {company.ticker && (
                        <p className="text-xs text-muted-foreground font-mono">{company.ticker}</p>
                      )}
                    </div>
                    {company.industry && (
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {formatIndustry(company.industry)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
