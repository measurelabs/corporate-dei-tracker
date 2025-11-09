'use client'

import { useEffect, useState } from 'react'
import { api, AnalyticsOverview } from '@/lib/api'
import { Building2, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SearchAutocomplete } from '@/components/search-autocomplete'
import { formatIndustry } from '@/lib/utils'
import Link from 'next/link'

const EXAMPLE_COMPANIES = [
  'Apple',
  'Microsoft',
  'Google',
  'Amazon',
  'Meta',
  'Tesla',
  'Netflix',
  'Salesforce'
]

interface FullProfile {
  id: string
  profile_id?: string
  company_id: string
  company_name?: string
  company_ticker?: string
  ticker?: string
  company_industry?: string
  industry?: string
  // Flattened structure from profiles_full
  dei_status?: string
  ai_executive_summary?: string
  executive_summary?: string
  overall_risk_score?: number
  risk_level?: string
  commitment_count?: number
  ongoing_lawsuits?: number
  settled_cases?: number
  // Nested structure from getFullProfile
  dei_posture?: {
    status?: string
  }
  ai_context?: {
    executive_summary?: string | null
  }
  risk_assessment?: {
    overall_risk_score?: number
    risk_level?: string
  }
}

export default function LandingPage() {
  const [typewriterText, setTypewriterText] = useState('')
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [featuredProfiles, setFeaturedProfiles] = useState<FullProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AnalyticsOverview | null>(null)

  // Typewriter effect
  useEffect(() => {
    const currentCompany = EXAMPLE_COMPANIES[currentCompanyIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (typewriterText.length < currentCompany.length) {
            setTypewriterText(currentCompany.slice(0, typewriterText.length + 1))
          } else {
            // Pause before deleting
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          // Deleting
          if (typewriterText.length > 0) {
            setTypewriterText(typewriterText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentCompanyIndex((currentCompanyIndex + 1) % EXAMPLE_COMPANIES.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )

    return () => clearTimeout(timeout)
  }, [typewriterText, isDeleting, currentCompanyIndex])

  // Load featured companies with full profile data
  useEffect(() => {
    loadFeaturedProfiles()
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const analytics = await api.getAnalyticsOverview()
      setStats(analytics)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  const loadFeaturedProfiles = async () => {
    try {
      setLoading(true)
      // Try to get at-risk profiles (they have rich data)
      try {
        const atRiskResponse = await api.getAtRiskProfiles(10)
        console.log('At-risk profiles loaded:', atRiskResponse)

        if (atRiskResponse && atRiskResponse.length > 0) {
          console.log('Sample profile data:', atRiskResponse[0])
          // Pick 3 random from the at-risk list
          const shuffled = atRiskResponse.sort(() => 0.5 - Math.random())
          const selected = shuffled.slice(0, 3)
          console.log('Selected profiles:', selected)
          setFeaturedProfiles(selected)
          return
        }
      } catch (err) {
        console.error('At-risk endpoint failed, falling back to regular companies:', err)
      }

      // Fallback: Get regular companies with profiles
      const response = await api.getCompanies(1, 50)
      const companies = response.data || []

      // Filter to only companies with profiles and pick 3 random
      const companiesWithProfiles = companies.filter(c => c.profile_id)
      const shuffled = companiesWithProfiles.sort(() => 0.5 - Math.random()).slice(0, 3)

      // Fetch full profiles for these companies
      const profilePromises = shuffled.map(async (company) => {
        try {
          const profile = await api.getFullProfile(company.profile_id!)
          return {
            ...profile,
            company_id: company.id,
            company_name: company.name,
            ticker: company.ticker,
            industry: company.industry
          }
        } catch (err) {
          console.error('Failed to load profile:', err)
          return null
        }
      })

      const profiles = (await Promise.all(profilePromises)).filter(Boolean) as FullProfile[]
      setFeaturedProfiles(profiles)

    } catch (error) {
      console.error('Failed to load featured profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-5xl mx-auto">
            {/* Hero Text */}
            <div className="text-center mb-10 sm:mb-12">
              {/* Logo and Wordmark */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-4 md:gap-5 mb-5 sm:mb-6">
                <img
                  src="/logo.png"
                  alt="Measure Labs Logo"
                  className="h-10 sm:h-14 md:h-18 lg:h-20 w-auto"
                />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  MEASURE Labs
                </span>
              </div>

              <div className="inline-flex items-center rounded-md border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/50 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 mb-4 backdrop-blur-sm">
                Corporate Intelligence Platform
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 sm:mb-4 text-gray-900 dark:text-gray-100 px-4 sm:px-0">
                Corporate DEI Commitments.
                <br />
                <span className="relative inline-block pb-2">
                  <span className="relative z-10 text-gray-900 dark:text-gray-100">Tracked & Verified.</span>
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-600/40 dark:to-yellow-500/40 -z-0 animate-highlight"
                    style={{
                      animation: 'highlight 1.5s ease-out forwards',
                      animationDelay: '0.5s',
                      opacity: 0
                    }}
                  />
                </span>
              </h1>
              <style jsx>{`
                @keyframes highlight {
                  0% {
                    opacity: 0;
                    transform: scaleX(0);
                    transform-origin: left;
                  }
                  50% {
                    opacity: 1;
                  }
                  100% {
                    opacity: 1;
                    transform: scaleX(1);
                    transform-origin: left;
                  }
                }
              `}</style>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
                Monitor which companies are advancing equity—and which are scaling back.
              </p>

              {/* Search Bar with Autocomplete */}
              <SearchAutocomplete
                placeholder={`Search ${typewriterText}...`}
                className="max-w-2xl mx-auto mb-6 px-4 sm:px-0"
              />

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
                <Link href="/companies" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Browse All Companies
                </Link>
                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
                <Link href="/at-risk" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Companies At Risk
                </Link>
                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
                <Link href="/top-committed" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Top Committed
                </Link>
              </div>
            </div>

            {/* Featured Companies - Inside Hero */}
            <div className="mt-10 sm:mt-12">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-lg border border-gray-200 dark:border-gray-800"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {featuredProfiles.map((profile) => (
                    <Link
                      key={profile.id}
                      href={`/companies/${profile.company_id}`}
                      className="group"
                    >
                      <div className="h-full p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-lg transition-colors duration-150">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                              {profile.company_name || 'Unknown Company'}
                            </h3>
                            {(profile.company_ticker || profile.ticker) && (
                              <span className="inline-block px-1.5 py-0.5 text-xs font-mono font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                                {profile.company_ticker || profile.ticker}
                              </span>
                            )}
                          </div>
                          <Building2 className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(profile.dei_status || profile.dei_posture?.status) && (
                            <Badge
                              variant={
                                (profile.dei_status || profile.dei_posture?.status || '').toLowerCase().includes('eliminated') ? 'red' :
                                (profile.dei_status || profile.dei_posture?.status || '').toLowerCase().includes('scaling_back') || (profile.dei_status || profile.dei_posture?.status || '').toLowerCase().includes('retreat') ? 'yellow' :
                                (profile.dei_status || profile.dei_posture?.status || '').toLowerCase().includes('committed') ? 'green' :
                                (profile.dei_status || profile.dei_posture?.status || '').toLowerCase().includes('active') || (profile.dei_status || profile.dei_posture?.status || '').toLowerCase().includes('strong') ? 'green' :
                                (profile.dei_status || profile.dei_posture?.status || '').toLowerCase().includes('moderate') ? 'blue' :
                                'outline'
                              }
                              className="text-xs"
                            >
                              {(profile.dei_status || profile.dei_posture?.status || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Badge>
                          )}
                          {(profile.risk_level || profile.risk_assessment?.risk_level) && (
                            <Badge
                              variant={
                                (profile.risk_level || profile.risk_assessment?.risk_level || '').toLowerCase() === 'high' ? 'orange' :
                                (profile.risk_level || profile.risk_assessment?.risk_level || '').toLowerCase() === 'medium' ? 'yellow' :
                                (profile.risk_level || profile.risk_assessment?.risk_level || '').toLowerCase() === 'low' ? 'green' :
                                'gray'
                              }
                              className="text-xs"
                            >
                              {(profile.risk_level || profile.risk_assessment?.risk_level || '').toLowerCase() === 'medium' ? 'Mid Risk' :
                               (profile.risk_level || profile.risk_assessment?.risk_level || '').toLowerCase() === 'low' ? 'Low Risk' :
                               (profile.risk_level || profile.risk_assessment?.risk_level || '').toLowerCase() === 'high' ? 'High Risk' :
                               (profile.risk_level || profile.risk_assessment?.risk_level)}
                            </Badge>
                          )}
                          {(profile.overall_risk_score || profile.risk_assessment?.overall_risk_score) && (
                            <Badge variant="outline" className="text-xs">
                              Risk: {profile.overall_risk_score || profile.risk_assessment?.overall_risk_score}/100
                            </Badge>
                          )}
                        </div>

                        {/* Summary */}
                        {(profile.ai_executive_summary || profile.executive_summary || profile.ai_context?.executive_summary) && (() => {
                          const summary = profile.ai_executive_summary || profile.executive_summary || profile.ai_context?.executive_summary || ''
                          // Get first sentence - use character limit approach to avoid issues with initials
                          // Truncate at first period after 50 characters, or show up to 200 characters
                          let truncated = summary
                          if (summary.length > 50) {
                            const periodAfter50 = summary.indexOf('. ', 50)
                            if (periodAfter50 !== -1 && periodAfter50 < 200) {
                              truncated = summary.substring(0, periodAfter50 + 1)
                            } else if (summary.length > 200) {
                              truncated = summary.substring(0, 200) + '...'
                            }
                          }
                          return (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                              {truncated}
                            </p>
                          )
                        })()}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="line-clamp-1">{formatIndustry(profile.industry)}</span>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="text-center mt-8">
                <Link href="/companies">
                  <Button size="default" variant="outline" className="rounded-md px-6">
                    View All Companies
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                {stats ? stats.total_companies.toLocaleString() : '500+'}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Companies Tracked
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                {stats ? stats.total_commitments.toLocaleString() : '10K+'}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                DEI Commitments
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                {stats ? stats.total_sources.toLocaleString() : 'Daily'}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {stats ? 'Data Sources' : 'Updates'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
