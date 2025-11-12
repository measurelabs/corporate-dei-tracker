'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { api, Company } from '@/lib/api'
import { CompanyCard } from '@/components/company-card'
import { CompanyTable } from '@/components/company-table'
import { CompanyList } from '@/components/company-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ChevronLeft, ChevronRight, Filter, X, LayoutGrid, List, Table } from 'lucide-react'

type ViewMode = 'grid' | 'list' | 'table'

function CompaniesContent() {
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState(() => searchParams.get('search') || '')
  const [searchInput, setSearchInput] = useState(() => searchParams.get('search') || '')
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedMarketCapTiers, setSelectedMarketCapTiers] = useState<string[]>([])
  const [sort, setSort] = useState('name')
  const [order, setOrder] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [industries, setIndustries] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null)
  const [totalCompanies, setTotalCompanies] = useState<number>(0)

  const marketCapTiers = ['Mega Cap', 'Large Cap', 'Mid Cap', 'Small Cap', 'Micro Cap']

  // Load filter options once on mount
  useEffect(() => {
    loadFilterOptions()
  }, [])

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (searchDebounce) {
        clearTimeout(searchDebounce)
      }
    }
  }, [searchDebounce])

  // Different loading behavior for table view (infinite) vs grid/list (pagination)
  useEffect(() => {
    if (viewMode === 'table') {
      // For table view, reset and load first page
      setPage(1)
      setCompanies([])
      loadCompanies(1)
    } else {
      // For grid/list, load current page
      loadCompanies()
    }
  }, [search, selectedIndustries, selectedCountries, selectedStates, selectedMarketCapTiers, sort, order, viewMode])

  useEffect(() => {
    if (viewMode !== 'table') {
      loadCompanies()
    }
  }, [page])

  const loadFilterOptions = async () => {
    try {
      // Use dedicated endpoint that returns only filter options
      const filterOptions = await api.getFilterOptions()

      console.log('Loaded filter options:', {
        industries: filterOptions.industries.length,
        countries: filterOptions.countries.length,
        states: filterOptions.states.length
      })

      setIndustries(filterOptions.industries)
      setCountries(filterOptions.countries)
      setStates(filterOptions.states)
    } catch (error) {
      console.error('Failed to load filter options:', error)
    }
  }

  const loadCompanies = async (pageToLoad?: number) => {
    try {
      const isLoadingMore = pageToLoad && pageToLoad > 1

      if (isLoadingMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const currentPage = pageToLoad || page

      // Fetch all companies if filters are active (for client-side filtering)
      const fetchAll = selectedIndustries.length > 0 || selectedCountries.length > 0 || selectedStates.length > 0 || selectedMarketCapTiers.length > 0

      const response = await api.getCompanies(
        fetchAll ? 1 : currentPage,
        fetchAll ? 100 : (viewMode === 'table' ? 50 : 12),
        search || undefined,
        undefined, // Don't use single-value filters anymore
        undefined,
        undefined,
        sort || undefined,
        order || undefined
      )

      let filteredCompanies = response.data || []

      // Client-side filtering for multi-select
      if (selectedIndustries.length > 0) {
        filteredCompanies = filteredCompanies.filter(c => c.industry && selectedIndustries.includes(c.industry))
      }
      if (selectedCountries.length > 0) {
        filteredCompanies = filteredCompanies.filter(c => c.hq_country && selectedCountries.includes(c.hq_country))
      }
      if (selectedStates.length > 0) {
        filteredCompanies = filteredCompanies.filter(c => c.hq_state && selectedStates.includes(c.hq_state))
      }
      if (selectedMarketCapTiers.length > 0) {
        filteredCompanies = filteredCompanies.filter(c => {
          const revenue = c.revenue_usd || 0
          const tier = getMarketCapTier(revenue)
          return tier && selectedMarketCapTiers.includes(tier)
        })
      }

      // Apply sorting client-side when filters are active
      if (fetchAll) {
        filteredCompanies.sort((a, b) => {
          let aVal: any
          let bVal: any

          switch (sort) {
            case 'name':
              aVal = a.name || ''
              bVal = b.name || ''
              break
            case 'ticker':
              aVal = a.ticker || ''
              bVal = b.ticker || ''
              break
            case 'industry':
              aVal = a.industry || ''
              bVal = b.industry || ''
              break
            case 'revenue_usd':
              aVal = a.revenue_usd || 0
              bVal = b.revenue_usd || 0
              break
            case 'created_at':
              aVal = new Date(a.created_at).getTime()
              bVal = new Date(b.created_at).getTime()
              break
            default:
              aVal = a.name || ''
              bVal = b.name || ''
          }

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            const comparison = aVal.localeCompare(bVal)
            return order === 'desc' ? -comparison : comparison
          } else if (typeof aVal === 'number' && typeof bVal === 'number') {
            return order === 'desc' ? bVal - aVal : aVal - bVal
          } else {
            // Handle null/undefined values
            if (aVal === null || aVal === undefined) return 1
            if (bVal === null || bVal === undefined) return -1
            return 0
          }
        })
      }

      // Paginate client-side if filters are active
      if (fetchAll) {
        const totalCount = filteredCompanies.length
        const perPage = viewMode === 'table' ? 50 : 12
        const totalPages = Math.ceil(totalCount / perPage)
        const start = (currentPage - 1) * perPage
        const end = start + perPage

        if (viewMode === 'table' && isLoadingMore) {
          setCompanies(prev => [...prev, ...filteredCompanies.slice(start, end)])
        } else {
          setCompanies(filteredCompanies.slice(start, end))
        }
        setTotalPages(totalPages || 1)
      } else {
        if (viewMode === 'table' && isLoadingMore) {
          setCompanies(prev => [...prev, ...filteredCompanies])
        } else {
          setCompanies(filteredCompanies)
        }
        setTotalPages(response.total_pages || 1)
        setTotalCompanies(response.total || 0)
      }
    } catch (error) {
      console.error('Failed to load companies:', error)
      setError('Failed to load companies. Please check if the API is running.')
      if (!loadingMore) {
        setCompanies([])
      }
      setTotalPages(1)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadCompanies(nextPage)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInput(value)

    // Clear existing timeout
    if (searchDebounce) {
      clearTimeout(searchDebounce)
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      setSearch(value)
      setPage(1)
    }, 300)

    setSearchDebounce(timeout)
  }

  const getMarketCapTier = (revenue: number): string | null => {
    if (revenue >= 200_000_000_000) return 'Mega Cap'
    if (revenue >= 10_000_000_000) return 'Large Cap'
    if (revenue >= 2_000_000_000) return 'Mid Cap'
    if (revenue >= 300_000_000) return 'Small Cap'
    if (revenue > 0) return 'Micro Cap'
    return null
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-10 sm:pb-12">
          <div className="max-w-5xl">
            <div className="inline-flex items-center rounded-md border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/50 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 mb-3 backdrop-blur-sm">
              Corporate Intelligence Platform
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
              Companies
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4 sm:mb-6">
              Explore comprehensive diversity, equity, and inclusion data across <span className="font-bold text-gray-900 dark:text-gray-100">{totalCompanies > 0 ? totalCompanies : '360'} companies</span>. Search by name or ticker, filter by industry, location, and market cap to track corporate DEI commitments, controversies, and accountability.
            </p>

            {/* Search Section */}
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                    <Input
                      placeholder="Search companies..."
                      value={searchInput}
                      onChange={handleSearchChange}
                      className="h-11 sm:h-12 pl-9 sm:pl-11 pr-20 sm:pr-24 text-sm sm:text-base bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-300 dark:border-gray-700 transition-colors rounded-lg font-medium"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 sm:h-8 px-4 sm:px-6 text-xs sm:text-sm font-semibold rounded-md bg-gray-800/95 dark:bg-gray-700/95 hover:opacity-90 backdrop-blur-sm text-white border-0"
                    >
                      Search
                    </Button>
                  </div>
                </form>

                {/* View Switcher */}
                <div className="flex items-center gap-1 border border-border rounded p-1 bg-background/50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors duration-150 ${
                      viewMode === 'grid'
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors duration-150 ${
                      viewMode === 'list'
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded transition-colors duration-150 ${
                      viewMode === 'table'
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Table view"
                  >
                    <Table className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-11 sm:h-12 px-4 sm:px-5 text-xs sm:text-sm rounded-lg"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-md">
                  {/* Filter Groups */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Industries */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Industries</label>
                      <div className="max-h-32 sm:max-h-40 overflow-y-auto space-y-1 text-sm">
                        {industries.slice(0, 10).map((ind) => (
                          <label key={ind} className="flex items-center gap-2 cursor-pointer hover:text-foreground px-2 py-1 rounded">
                            <input
                              type="checkbox"
                              checked={selectedIndustries.includes(ind)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIndustries([...selectedIndustries, ind])
                                } else {
                                  setSelectedIndustries(selectedIndustries.filter(i => i !== ind))
                                }
                                setPage(1)
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="truncate text-xs">{ind.split(' - ')[0]}</span>
                          </label>
                        ))}
                        {industries.length > 10 && (
                          <a
                            href="/industries"
                            className="block text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-2 py-1 mt-2"
                          >
                            View all industries →
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Countries */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Countries</label>
                      <div className="max-h-32 sm:max-h-40 overflow-y-auto space-y-1 text-sm">
                        {countries.slice(0, 10).map((c) => (
                          <label key={c} className="flex items-center gap-2 cursor-pointer hover:text-foreground px-2 py-1 rounded">
                            <input
                              type="checkbox"
                              checked={selectedCountries.includes(c)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCountries([...selectedCountries, c])
                                } else {
                                  setSelectedCountries(selectedCountries.filter(co => co !== c))
                                }
                                setPage(1)
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="truncate text-xs">{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* States */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">States</label>
                      <div className="max-h-32 sm:max-h-40 overflow-y-auto space-y-1 text-sm">
                        {states.slice(0, 10).map((s) => (
                          <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-foreground px-2 py-1 rounded">
                            <input
                              type="checkbox"
                              checked={selectedStates.includes(s)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStates([...selectedStates, s])
                                } else {
                                  setSelectedStates(selectedStates.filter(st => st !== s))
                                }
                                setPage(1)
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="truncate text-xs">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Market Cap Tier */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Market Cap</label>
                      <div className="max-h-40 overflow-y-auto space-y-1 text-sm">
                        {marketCapTiers.map((tier) => (
                          <label key={tier} className="flex items-center gap-2 cursor-pointer hover:text-foreground px-2 py-1 rounded">
                            <input
                              type="checkbox"
                              checked={selectedMarketCapTiers.includes(tier)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMarketCapTiers([...selectedMarketCapTiers, tier])
                                } else {
                                  setSelectedMarketCapTiers(selectedMarketCapTiers.filter(t => t !== tier))
                                }
                                setPage(1)
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="truncate text-xs">{tier}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sort and Clear */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <label className="text-xs text-muted-foreground font-medium">Sort by:</label>
                    <select
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value)
                        setPage(1)
                      }}
                      className="h-9 px-3 text-sm border border-border rounded-md bg-background"
                    >
                      <option value="name">Name</option>
                      <option value="ticker">Ticker</option>
                      <option value="industry">Industry</option>
                      <option value="revenue_usd">Market Cap</option>
                      <option value="created_at">Date Added</option>
                    </select>

                    <select
                      value={order}
                      onChange={(e) => {
                        setOrder(e.target.value)
                        setPage(1)
                      }}
                      className="h-9 px-3 text-sm border border-border rounded-md bg-background"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>

                    {(selectedIndustries.length > 0 || selectedCountries.length > 0 || selectedStates.length > 0 || selectedMarketCapTiers.length > 0 || search) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedIndustries([])
                          setSelectedCountries([])
                          setSelectedStates([])
                          setSelectedMarketCapTiers([])
                          setSearch('')
                          setSearchInput('')
                          setPage(1)
                        }}
                        className="h-9 px-3 text-sm ml-auto"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {(selectedIndustries.length > 0 || selectedCountries.length > 0 || selectedStates.length > 0 || selectedMarketCapTiers.length > 0 || search) && (
                <div className="flex flex-wrap gap-2 text-sm">
                  {search && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs">
                      Search: {search}
                    </span>
                  )}
                  {selectedIndustries.map(ind => (
                    <span key={ind} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
                      {ind.split(' - ')[0]}
                    </span>
                  ))}
                  {selectedCountries.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                      {c}
                    </span>
                  ))}
                  {selectedStates.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs">
                      {s}
                    </span>
                  ))}
                  {selectedMarketCapTiers.map(tier => (
                    <span key={tier} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs">
                      {tier}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {error && (
          <div className="max-w-7xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-lg border border-gray-200 dark:border-gray-800"
              />
            ))}
          </div>
        ) : !companies || companies.length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">No companies found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search query</p>
          </div>
        ) : (
          <>
            {/* Companies Views */}
            <div className="max-w-7xl mx-auto mb-12">
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <CompanyList companies={companies} />
              )}

              {viewMode === 'table' && (
                <CompanyTable
                  companies={companies}
                  hasMore={page < totalPages}
                  onLoadMore={handleLoadMore}
                  isLoading={loadingMore}
                />
              )}
            </div>

            {/* Pagination - Only show for grid and list views */}
            {viewMode !== 'table' && (
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-9 sm:h-10 px-2 sm:px-4 rounded-md font-medium transition-all hover:text-foreground disabled:opacity-40 text-xs sm:text-sm"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <span className="text-xs sm:text-sm font-medium">
                    Page {page}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600 text-xs sm:text-sm">of</span>
                  <span className="text-xs sm:text-sm font-medium">
                    {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-9 sm:h-10 px-2 sm:px-4 rounded-lg font-medium transition-all hover:text-foreground disabled:opacity-40 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 sm:ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function Companies() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </div>
    }>
      <CompaniesContent />
    </Suspense>
  )
}
