'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, TrendingUp, Search, BarChart3, Menu, X, ExternalLink, Award, ShieldAlert, Briefcase, ChevronDown } from 'lucide-react'
import { cn, formatIndustry } from '@/lib/utils'
import { api, IndustryStats } from '@/lib/api'
import { CommandMenu } from './command-menu'

const navItems = [
  {
    title: 'Companies',
    href: '/companies',
    icon: Building2,
  },
  {
    title: 'Industries',
    href: '/industries',
    icon: Briefcase,
  },
  // {
  //   title: 'Top Committed',
  //   href: '/top-committed',
  //   icon: Award,
  // },
  // {
  //   title: 'At-Risk',
  //   href: '/at-risk',
  //   icon: ShieldAlert,
  // },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
  },
]

// Helper function to get slug from industry name
function getIndustrySlug(industry: string): string {
  return industry.toLowerCase()
    .replace(/[\s&]+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false)
  const [industries, setIndustries] = useState<IndustryStats[]>([])
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandMenuOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Load industries on mount
  useEffect(() => {
    const loadIndustries = async () => {
      try {
        const stats = await api.getIndustryStats()
        // Sort by company count and take top industries
        const sortedStats = stats
          .sort((a, b) => b.company_count - a.company_count)
          .slice(0, 12) // Show top 12 industries in dropdown
        setIndustries(sortedStats)
      } catch (error) {
        console.error('Failed to load industries:', error)
      }
    }
    loadIndustries()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.industries-dropdown')) {
        setIsIndustriesOpen(false)
      }
    }

    if (isIndustriesOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isIndustriesOpen])

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b border-border transition-colors duration-150',
          isScrolled
            ? 'bg-background/95 backdrop-blur-sm'
            : 'bg-background/90 backdrop-blur-sm'
        )}
      >
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
          <div className="relative flex h-12 md:h-14 items-center justify-center">
            {/* Logo - Absolute Left */}
            <div className="absolute left-0 flex items-center max-w-[40%] xl:max-w-none">
              <Link
                href="/"
                className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 group"
              >
                <img
                  src="/logo.png"
                  alt="Measure Labs Logo"
                  className="h-5 sm:h-5 md:h-6 w-auto shrink-0"
                />
                <span className="font-bold text-xs sm:text-xs md:text-sm lg:text-sm tracking-tight">
                  MEASURE Labs
                </span>
                <span className="text-muted-foreground font-normal hidden xl:inline text-xs">|</span>
                <span className="text-[11px] text-muted-foreground font-medium tracking-wide hidden xl:inline">
                  Corporate DEI Tracker
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

                // Special handling for Industries with dropdown
                if (item.href === '/industries') {
                  return (
                    <div key={item.href} className="relative industries-dropdown">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsIndustriesOpen(!isIndustriesOpen)
                        }}
                        className={cn(
                          'relative flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded text-xs font-medium transition-colors duration-150',
                          isActive
                            ? 'text-foreground bg-accent'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{item.title}</span>
                        {isActive && (
                          <span className="absolute inset-x-0 -bottom-px h-0.5 bg-black dark:bg-white rounded-t-full" />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {isIndustriesOpen && (
                        <div className="absolute top-full left-0 mt-1 w-96 bg-card border border-border rounded z-50">
                          <div className="p-3">
                            <Link
                              href="/industries"
                              onClick={() => setIsIndustriesOpen(false)}
                              className="block px-3 py-2 text-xs font-medium text-foreground rounded transition-colors duration-150"
                            >
                              View All Industries
                            </Link>
                            <div className="my-2 border-t border-border" />
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                              {industries.map((industry) => (
                                <Link
                                  key={industry.industry}
                                  href={`/industries/${getIndustrySlug(industry.industry)}`}
                                  onClick={() => setIsIndustriesOpen(false)}
                                  className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded transition-colors duration-150"
                                >
                                  <span className="text-left">{formatIndustry(industry.industry)}</span>
                                  <span className="text-[10px] text-gray-500 ml-2 shrink-0">
                                    {industry.company_count}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150',
                      isActive
                        ? 'text-foreground bg-accent'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.title}</span>
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-black dark:bg-white rounded-t-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Section - Absolute Right */}
            <div className="absolute right-0 flex items-center gap-1.5">
              {/* Search Button */}
              <button
                onClick={() => setCommandMenuOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
                aria-label="Search"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border rounded">
                  <span>⌘</span>
                  <span>K</span>
                </kbd>
              </button>

              <Link
                href="/about"
                className="hidden md:flex items-center px-3 py-1.5 rounded text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <span>About</span>
              </Link>

              <Link
                href="/dev"
                className="hidden md:flex items-center px-3 py-1.5 rounded text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-150"
              >
                <span>Dev</span>
              </Link>

              <Link
                href="/docs"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-colors duration-150"
              >
                <span>API</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded transition-colors duration-150"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden border-t border-border bg-background/95 backdrop-blur-sm overflow-hidden transition-all duration-200',
            isMobileMenuOpen ? 'max-h-[80vh] overflow-y-auto opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

              // Special handling for Industries in mobile menu
              if (item.href === '/industries') {
                return (
                  <div key={item.href}>
                    <Link
                      href="/industries"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors duration-150',
                        isActive
                          ? 'text-foreground bg-accent'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>All Industries</span>
                    </Link>
                    {/* Industry submenu items */}
                    <div className="ml-8 mt-1 space-y-1">
                      {industries.slice(0, 6).map((industry) => (
                        <Link
                          key={industry.industry}
                          href={`/industries/${getIndustrySlug(industry.industry)}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
                        >
                          <span className="truncate">{formatIndustry(industry.industry)}</span>
                          <span className="text-[10px] text-gray-500">
                            {industry.company_count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-foreground bg-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 sm:hidden"
            >
              <span>About</span>
            </Link>
            <Link
              href="/dev"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 sm:hidden"
            >
              <span>Dev</span>
            </Link>
            <Link
              href="/docs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 sm:hidden"
            >
              <span>API</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-12 md:h-14" />

      {/* Command Menu */}
      <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
    </>
  )
}
