'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api, Company, IndustryStats } from '@/lib/api'
import { CompanyCard } from '@/components/company-card'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft, ChevronRight, Building2, Users, Target,
  AlertTriangle, Shield, TrendingUp, Award, BarChart3,
  Briefcase, Globe, MapPin
} from 'lucide-react'
import Link from 'next/link'

// Industry-specific SEO content and descriptions
const industryContent: Record<string, {
  title: string
  description: string
  keywords: string[]
  overview: string
  challenges: string[]
  opportunities: string[]
  keyInsights?: string[]
  strategicImplications?: string[]
}> = {
  'Technology': {
    title: 'Technology Industry DEI Analytics',
    description: 'Comprehensive diversity, equity, and inclusion metrics for technology companies. Track DEI commitments, leadership diversity, and corporate social responsibility in the tech sector.',
    keywords: ['tech diversity', 'technology DEI', 'silicon valley diversity', 'tech inclusion', 'software companies DEI'],
    overview: 'The technology sector plays a crucial role in shaping the future of work and society. With its global reach and influence, tech companies have both the opportunity and responsibility to lead in diversity, equity, and inclusion initiatives.',
    challenges: [
      'Historically low representation of women and underrepresented minorities in technical roles',
      'Pipeline challenges from education to senior leadership positions',
      'Retention issues due to non-inclusive workplace cultures'
    ],
    opportunities: [
      'Leveraging technology to create more inclusive products and services',
      'Setting industry standards for transparent DEI reporting',
      'Building diverse teams that drive innovation and better represent user bases'
    ],
    keyInsights: [
      'Companies with diverse leadership teams show 35% higher financial returns',
      'Only 26% of computing jobs are held by women despite making up 47% of the workforce',
      'Tech companies with CDOs report 2x higher employee satisfaction scores'
    ],
    strategicImplications: [
      'DEI initiatives directly correlate with innovation and market competitiveness',
      'Inclusive design practices expand addressable markets by billions of users',
      'Transparent DEI reporting increasingly influences investor decisions and valuations'
    ]
  },
  'Financial Services': {
    title: 'Financial Services DEI Analytics',
    description: 'Track diversity metrics and inclusion initiatives across banks, insurance companies, and financial institutions. Monitor DEI progress in the finance industry.',
    keywords: ['finance diversity', 'banking DEI', 'financial services inclusion', 'wall street diversity', 'insurance DEI'],
    overview: 'Financial services companies manage significant resources and influence economic opportunities worldwide. Their DEI practices directly impact access to capital, financial inclusion, and economic mobility for diverse communities.',
    challenges: [
      'Traditional hierarchical structures that may limit diverse advancement',
      'Need for more inclusive financial products and services',
      'Addressing historical disparities in lending and investment practices'
    ],
    opportunities: [
      'Expanding financial inclusion through diverse leadership and perspectives',
      'Creating innovative products that serve underbanked communities',
      'Leading in supplier diversity and community investment initiatives'
    ],
    keyInsights: [
      'Financial services firms with diverse boards see 18% higher ROI',
      'Women hold only 19% of C-suite positions in financial services',
      '67% of financial institutions now have formal DEI programs'
    ],
    strategicImplications: [
      'Diverse teams better assess risk and identify new market opportunities',
      'Inclusive lending practices open trillion-dollar underserved markets',
      'ESG-focused investors increasingly prioritize DEI metrics in valuations'
    ]
  },
  'Healthcare': {
    title: 'Healthcare Industry DEI Analytics',
    description: 'Monitor diversity, equity, and inclusion progress in healthcare organizations, pharmaceutical companies, and medical device manufacturers.',
    keywords: ['healthcare diversity', 'medical DEI', 'pharmaceutical inclusion', 'hospital diversity', 'health equity'],
    overview: 'The healthcare industry directly impacts the well-being of diverse populations. DEI in healthcare is not just about workforce diversity but also about health equity and culturally competent care.',
    challenges: [
      'Addressing health disparities across different demographic groups',
      'Increasing diversity in medical research and clinical trials',
      'Building culturally competent healthcare delivery systems'
    ],
    opportunities: [
      'Improving health outcomes through diverse medical teams and research',
      'Developing targeted solutions for underserved communities',
      'Leading in accessibility and inclusive healthcare design'
    ]
  },
  'Retail': {
    title: 'Retail Industry DEI Analytics',
    description: 'Explore diversity metrics and inclusion initiatives in retail companies, from e-commerce giants to traditional retailers.',
    keywords: ['retail diversity', 'e-commerce DEI', 'retail inclusion', 'consumer goods diversity', 'shopping DEI'],
    overview: 'Retail companies interact directly with diverse consumer bases daily. Their DEI practices influence both workplace culture and customer experience, making inclusion a business imperative.',
    challenges: [
      'Creating inclusive shopping experiences for all customers',
      'Ensuring fair labor practices across global supply chains',
      'Representing diverse communities in marketing and product offerings'
    ],
    opportunities: [
      'Capturing market share by authentically serving diverse consumer segments',
      'Building inclusive brands that resonate with global audiences',
      'Leading in accessible retail design and customer service'
    ]
  },
  'Manufacturing': {
    title: 'Manufacturing Industry DEI Analytics',
    description: 'Track diversity, equity, and inclusion progress in manufacturing companies, industrial firms, and production facilities worldwide.',
    keywords: ['manufacturing diversity', 'industrial DEI', 'factory inclusion', 'production diversity', 'supply chain DEI'],
    overview: 'Manufacturing forms the backbone of the global economy. DEI in manufacturing impacts job opportunities, innovation in production processes, and supply chain practices worldwide.',
    challenges: [
      'Overcoming historical gender imbalances in industrial roles',
      'Creating inclusive workplace cultures in traditional manufacturing settings',
      'Ensuring equitable opportunities across global operations'
    ],
    opportunities: [
      'Driving innovation through diverse engineering and design teams',
      'Building more resilient and ethical supply chains',
      'Creating pathways for economic mobility through inclusive hiring'
    ]
  }
}

// Generate SEO-friendly slug from industry name
function getIndustrySlug(industry: string): string {
  return industry.toLowerCase().replace(/[\s&]+/g, '-').replace(/[^\w-]/g, '')
}

// Get display name from slug
function getIndustryFromSlug(slug: string): string {
  const industryMap: Record<string, string> = {
    'technology': 'Technology',
    'financial-services': 'Financial Services',
    'healthcare': 'Healthcare',
    'retail': 'Retail',
    'manufacturing': 'Manufacturing',
    'energy': 'Energy',
    'telecommunications': 'Telecommunications',
    'consumer-goods': 'Consumer Goods',
    'automotive': 'Automotive',
    'media-entertainment': 'Media & Entertainment'
  }
  return industryMap[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Get industry color based on name
function getIndustryColor(industryName: string): string {
  const normalizedName = industryName.toLowerCase().trim()

  // Define colors with multiple possible matches for each industry - matching the overview page
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
        return color
      }
    }
  }

  // Generate a consistent fallback color based on the industry name hash
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

  return gradients[Math.abs(hashCode) % gradients.length]
}

export default function IndustryPage() {
  const params = useParams()
  const industrySlug = params.industry as string
  const industryName = getIndustryFromSlug(industrySlug)

  const [companies, setCompanies] = useState<Company[]>([])
  const [industryStats, setIndustryStats] = useState<IndustryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const perPage = 12

  const content = industryContent[industryName] || {
    title: `${industryName} Industry DEI Analytics`,
    description: `Track diversity, equity, and inclusion metrics for companies in the ${industryName} industry. Monitor DEI commitments, controversies, and progress.`,
    keywords: [`${industryName} diversity`, `${industryName} DEI`, `${industryName} inclusion`],
    overview: `The ${industryName} industry plays an important role in the global economy. Understanding and improving DEI practices in this sector is crucial for creating more equitable workplaces and better serving diverse stakeholders.`,
    challenges: [
      'Building more diverse and inclusive leadership teams',
      'Creating equitable advancement opportunities',
      'Fostering inclusive workplace cultures'
    ],
    opportunities: [
      'Leveraging diverse perspectives for innovation',
      'Better serving diverse customer bases',
      'Setting industry standards for DEI excellence'
    ],
    keyInsights: [
      'Diverse leadership teams demonstrate higher performance metrics',
      'Industry-specific DEI challenges require targeted solutions',
      'Stakeholder expectations for DEI transparency continue to rise'
    ],
    strategicImplications: [
      'DEI excellence increasingly determines competitive advantage',
      'Inclusive practices expand market reach and customer loyalty',
      'Transparent reporting influences investment and partnership decisions'
    ]
  }

  useEffect(() => {
    loadIndustryData()
  }, [industryName, page])

  const loadIndustryData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all companies first to see what industries exist
      const companiesResponse = await api.getCompanies(
        1, // Page
        100, // Max per request
        undefined, // No search
        undefined  // No industry filter initially
      )

      console.log('All companies:', companiesResponse.data)
      console.log('Industry names in data:', [...new Set(companiesResponse.data.map(c => c.industry).filter(Boolean))])
      console.log('Looking for industry:', industryName)

      // Filter companies by industry - more flexible matching
      let filteredCompanies = companiesResponse.data.filter(c => {
        if (!c.industry) return false

        // Try different matching strategies
        const companyIndustry = c.industry.toLowerCase()
        const searchIndustry = industryName.toLowerCase()

        // Check if industry contains the search term or vice versa
        return companyIndustry.includes(searchIndustry) ||
               searchIndustry.includes(companyIndustry) ||
               companyIndustry.replace(/[^a-z0-9]/g, '') === searchIndustry.replace(/[^a-z0-9]/g, '')
      })

      console.log('Filtered companies count:', filteredCompanies.length)

      // Sort by market cap (revenue as proxy) descending
      filteredCompanies.sort((a, b) => (b.revenue_usd || 0) - (a.revenue_usd || 0))

      // Calculate pagination
      const total = filteredCompanies.length
      const totalPages = Math.ceil(total / perPage)
      const start = (page - 1) * perPage
      const end = start + perPage

      setCompanies(filteredCompanies.slice(start, end))
      setTotalPages(totalPages || 1)

      // Load industry statistics
      const statsResponse = await api.getIndustryStats()
      console.log('Industry stats:', statsResponse)
      console.log('Industry names in stats:', statsResponse.map(s => s.industry))

      // Try to find matching industry stats with flexible matching
      const stats = statsResponse.find(s => {
        if (!s.industry) return false
        const statsIndustry = s.industry.toLowerCase()
        const searchIndustry = industryName.toLowerCase()

        return statsIndustry.includes(searchIndustry) ||
               searchIndustry.includes(statsIndustry) ||
               statsIndustry.replace(/[^a-z0-9]/g, '') === searchIndustry.replace(/[^a-z0-9]/g, '')
      })

      console.log('Found matching stats:', stats)
      setIndustryStats(stats || null)

    } catch (error) {
      console.error('Failed to load industry data:', error)
      setError('Failed to load industry data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // Calculate CDO percentage
  const cdoPercentage = industryStats
    ? Math.round((industryStats.companies_with_cdo / industryStats.company_count) * 100)
    : 0

  const industryGradient = getIndustryColor(industryName)

  return (
    <div className="min-h-screen">
      {/* SEO Metadata would be handled by Next.js metadata API */}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-background dark:to-purple-950/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/companies" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Companies
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">{industryName}</span>
          </nav>

          <div className="max-w-5xl">
            <div className="inline-flex items-center rounded-md border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/50 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-4 backdrop-blur-sm">
              Industry Intelligence
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-gray-100">
              {content.title}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-3xl">
              {content.description}
            </p>

            {/* Industry Stats Cards */}
            {industryStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Building2 className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Companies</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {industryStats.company_count}
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Commitments</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {industryStats.total_commitments}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {industryStats.active_commitments} active
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
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {industryStats.companies_with_cdo} companies
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Avg Sources</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {industryStats.avg_sources.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    per company
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Industry Overview */}
          <div className="mb-12 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Industry Overview</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {content.overview}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Key Challenges</h3>
                  </div>
                  <ul className="space-y-2">
                    {content.challenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 mt-1.5 text-xs">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Opportunities</h3>
                  </div>
                  <ul className="space-y-2">
                    {content.opportunities.map((opportunity, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-1.5 text-xs">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Insights Section */}
              {content.keyInsights && content.keyInsights.length > 0 && (
                <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Key Insights</h3>
                  </div>
                  <ul className="space-y-3">
                    {content.keyInsights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-blue-600 dark:text-blue-400 mt-1 text-sm">💡</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Strategic Implications Section */}
              {content.strategicImplications && content.strategicImplications.length > 0 && (
                <div className="mt-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Strategic Implications</h3>
                  </div>
                  <ul className="space-y-3">
                    {content.strategicImplications.map((implication, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-purple-600 dark:text-purple-400 mt-1 text-sm">🎯</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{implication}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Industry Metrics</h3>
                <div className="space-y-4">
                  {industryStats && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Controversies</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {industryStats.total_controversies}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Avg Commitments</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {industryStats.avg_commitments.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Active Commitments</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {Math.round((industryStats.active_commitments / industryStats.total_commitments) * 100)}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Related Industries</h3>
                <div className="space-y-2">
                  {['Technology', 'Financial Services', 'Healthcare', 'Retail', 'Manufacturing']
                    .filter(ind => ind !== industryName)
                    .slice(0, 3)
                    .map(ind => (
                      <Link
                        key={ind}
                        href={`/industries/${getIndustrySlug(ind)}`}
                        className="block text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                      >
                        {ind} →
                      </Link>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Companies Section */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Companies in {industryName}
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-lg border border-gray-200 dark:border-gray-800"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-500 dark:text-gray-400">No companies found in this industry</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                  {companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="h-10 px-4"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                      <span className="text-sm font-medium">Page {page}</span>
                      <span className="text-gray-400 text-sm">of</span>
                      <span className="text-sm font-medium">{totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="h-10 px-4"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}