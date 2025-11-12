'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api, IndustryStats } from '@/lib/api'
import { formatIndustry } from '@/lib/utils'
import {
  Building2, Users, Target, TrendingUp, BarChart3,
  ChevronRight, Briefcase, Globe, Award
} from 'lucide-react'

// Map industry names to slugs
function getIndustrySlug(industry: string): string {
  if (!industry) return ''
  return industry.toLowerCase().replace(/[\s&]+/g, '-').replace(/[^\w-]/g, '')
}

// Get industry color based on name
function getIndustryColor(industryName: string): string {
  if (!industryName) return 'from-gray-600 to-slate-600'
  const normalizedName = industryName.toLowerCase().trim()
  console.log(`[COLOR MATCH] Checking industry: "${industryName}" -> normalized: "${normalizedName}"`)

  // Define colors with multiple possible matches for each industry - more distinct colors
  const colorMappings: Array<[string[], string]> = [
    [['technology', 'tech', 'software', 'it', 'information technology', 'computer'], 'from-blue-600 to-indigo-600'],
    [['financial', 'finance', 'banking', 'investment', 'insurance', 'fintech'], 'from-emerald-600 to-teal-600'],
    [['healthcare', 'health', 'medical', 'pharmaceutical', 'pharma', 'biotech', 'hospital'], 'from-red-600 to-rose-600'],
    [['retail', 'e-commerce', 'shopping', 'store'], 'from-purple-600 to-pink-600'],
    [['manufacturing', 'industrial', 'production', 'factory'], 'from-orange-600 to-amber-600'],
    [['energy', 'oil', 'gas', 'utilities', 'power', 'renewable'], 'from-yellow-600 to-orange-500'],
    [['telecommunications', 'telecom', 'communication', 'wireless', 'mobile'], 'from-cyan-600 to-sky-600'],
    [['consumer', 'cpg', 'fmcg', 'goods'], 'from-fuchsia-600 to-purple-600'],
    [['automotive', 'auto', 'car', 'vehicle', 'transportation'], 'from-slate-600 to-zinc-600'],
    [['media', 'entertainment', 'broadcast', 'publishing', 'streaming'], 'from-violet-600 to-indigo-600'],
    [['real estate', 'property', 'realty', 'reit'], 'from-amber-700 to-yellow-600'],
    [['education', 'academic', 'university', 'school', 'training'], 'from-sky-700 to-blue-600'],
    [['hospitality', 'hotel', 'restaurant', 'tourism', 'travel'], 'from-rose-700 to-pink-600'],
    [['agriculture', 'farming', 'food', 'agri'], 'from-green-700 to-emerald-600'],
    [['aerospace', 'aviation', 'airline', 'defense'], 'from-indigo-700 to-purple-600'],
    [['construction', 'building', 'infrastructure'], 'from-stone-600 to-gray-600'],
    [['logistics', 'shipping', 'supply chain', 'freight'], 'from-teal-700 to-cyan-600']
  ]

  // Try to find a match
  for (const [keywords, color] of colorMappings) {
    for (const keyword of keywords) {
      if (normalizedName.includes(keyword)) {
        console.log(`[COLOR MATCH] ✓ MATCHED keyword "${keyword}" -> color: ${color}`)
        return color
      }
    }
  }

  console.log(`[COLOR MATCH] ✗ NO MATCH - using hash-based fallback color`)

  // Generate a consistent color based on the industry name hash
  const hashCode = normalizedName.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0)
  }, 0)

  const gradients = [
    'from-lime-600 to-green-600',
    'from-pink-700 to-fuchsia-600',
    'from-indigo-600 to-violet-600',
    'from-teal-600 to-emerald-600',
    'from-orange-700 to-red-600',
    'from-purple-700 to-indigo-600',
    'from-cyan-700 to-blue-600',
    'from-rose-600 to-pink-600'
  ]

  const fallbackColor = gradients[Math.abs(hashCode) % gradients.length]
  console.log(`[COLOR MATCH] Hash: ${hashCode}, Index: ${Math.abs(hashCode) % gradients.length}, Fallback color: ${fallbackColor}`)

  return fallbackColor
}

// Industry icons mapping
const industryIcons: Record<string, any> = {
  'technology': '💻',
  'financial-services': '💰',
  'healthcare': '🏥',
  'retail': '🛍️',
  'manufacturing': '🏭',
  'energy': '⚡',
  'telecommunications': '📡',
  'consumer-goods': '📦',
  'automotive': '🚗',
  'media-entertainment': '🎬'
}

export default function IndustriesOverview() {
  const [industryStats, setIndustryStats] = useState<IndustryStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadIndustryStats()
  }, [])

  const loadIndustryStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const stats = await api.getIndustryStats()

      console.log('Industry stats received:', stats)
      console.log('Industry names:', stats.map(s => s.industry))

      // Sort by company count descending
      const sortedStats = stats.sort((a, b) => b.company_count - a.company_count)

      setIndustryStats(sortedStats)
    } catch (error) {
      console.error('Failed to load industry statistics:', error)
      setError('Failed to load industry data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals across all industries
  const totals = industryStats.reduce((acc, curr) => ({
    companies: acc.companies + curr.company_count,
    commitments: acc.commitments + curr.total_commitments,
    activeCommitments: acc.activeCommitments + curr.active_commitments,
    controversies: acc.controversies + curr.total_controversies,
    companiesWithCDO: acc.companiesWithCDO + curr.companies_with_cdo
  }), {
    companies: 0,
    commitments: 0,
    activeCommitments: 0,
    controversies: 0,
    companiesWithCDO: 0
  })

  const cdoPercentage = totals.companies > 0
    ? Math.round((totals.companiesWithCDO / totals.companies) * 100)
    : 0

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-violet-950/20 dark:via-background dark:to-indigo-950/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="max-w-5xl">
            <div className="inline-flex items-center rounded-md border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/50 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 mb-4 backdrop-blur-sm">
              Industry Intelligence Platform
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-gray-100">
              Industry DEI Analytics
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-3xl">
              Explore comprehensive diversity, equity, and inclusion metrics across different industries.
              Compare performance, track commitments, and identify leaders in corporate responsibility.
            </p>

            {/* Global Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Total Companies</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totals.companies}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <Target className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Commitments</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totals.commitments}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Active</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totals.activeCommitments}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">CDO Presence</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {cdoPercentage}%
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Industries</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {industryStats.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : industryStats.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400">No industry data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryStats.map((industry, index) => {
                const slug = getIndustrySlug(industry.industry)
                const gradient = getIndustryColor(industry.industry)
                const icon = industryIcons[slug] || '🏢'
                const cdoPercent = industry.company_count > 0
                  ? Math.round((industry.companies_with_cdo / industry.company_count) * 100)
                  : 0

                // Log the final gradient assignment
                if (index === 0) {
                  console.log('=== COLOR ASSIGNMENT SUMMARY ===')
                }
                console.log(`[${index + 1}] "${industry.industry}" -> ${gradient}`)

                return (
                  <Link
                    key={industry.industry}
                    href={`/industries/${slug}`}
                    className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300"
                  >
                    {/* Dynamic color border at top - unique for each industry */}
                    <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                    <div className="p-6">
                      {/* Industry Name with Icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{icon}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {formatIndustry(industry.industry)}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {industry.company_count} companies
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Commitments</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {industry.total_commitments}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {industry.active_commitments} active
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">CDO Presence</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {cdoPercent}%
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {industry.companies_with_cdo} companies
                          </p>
                        </div>
                      </div>

                      {/* Bottom Stats Bar */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <BarChart3 className="h-3 w-3" />
                            <span>Avg {industry.avg_sources.toFixed(1)} sources</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <Target className="h-3 w-3" />
                            <span>{industry.avg_commitments.toFixed(1)} per company</span>
                          </div>
                        </div>
                      </div>

                      {/* Controversy Indicator */}
                      {industry.total_controversies > 0 && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                          {industry.total_controversies} controversies
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

        </div>
      </div>

      {/* SEO Content Section - Full Width */}
      <div className="mt-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="relative py-16">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/30 dark:from-indigo-950/10 dark:to-purple-950/10" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center rounded-md border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/50 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-4">
                  Industry Intelligence
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Understanding Industry DEI Performance
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Our comprehensive industry analytics provide insights into diversity, equity, and inclusion
                  practices across different sectors. By tracking commitments, controversies, and leadership
                  diversity metrics, we help stakeholders understand which industries are leading in corporate
                  responsibility and where improvement is needed.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="mb-16">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-8 text-center">
                  Key Metrics We Track
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                          %
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Chief Diversity Officer (CDO) Presence
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          The percentage of companies with dedicated diversity leadership
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Active Commitments
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ongoing DEI initiatives and pledges being actively pursued
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Transparency Score
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          How openly companies report on their DEI progress
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                          ⚠️
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Controversy Tracking
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Monitoring DEI-related incidents and their resolutions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why It Matters Section */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
                <h3 className="text-2xl font-bold mb-6">
                  Why Industry-Level Analysis Matters
                </h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-2">For Companies</h4>
                    <p className="text-sm text-white/90">
                      Understand relative performance and identify best practices from industry leaders
                    </p>
                  </div>
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-2">For Investors</h4>
                    <p className="text-sm text-white/90">
                      Make informed decisions based on comprehensive DEI risk and opportunity analysis
                    </p>
                  </div>
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-2">For Advocates</h4>
                    <p className="text-sm text-white/90">
                      Identify where to focus efforts for maximum impact on workplace equity
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-sm text-white/90 text-center">
                    By providing transparent, data-driven insights, we aim to accelerate progress toward more
                    equitable and inclusive workplaces across all sectors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}