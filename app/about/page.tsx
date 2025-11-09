'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  Users,
  TrendingUp,
  Eye,
  Building2,
  Shield,
  ExternalLink,
  Code
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { api, AnalyticsOverview } from '@/lib/api'

const sections = [
  { id: 'problem', label: 'The Problem' },
  { id: 'solution', label: 'Our Solution' },
  { id: 'serves', label: 'Who This Serves' },
  { id: 'matters', label: 'Why It Matters' },
  { id: 'approach', label: 'Our Approach' },
  { id: 'next', label: "What's Next" },
]

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('problem')
  const [stats, setStats] = useState<AnalyticsOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const analytics = await api.getAnalyticsOverview()
        setStats(analytics)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Table of Contents - Desktop Only */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                On This Page
              </p>
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    'block w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors',
                    activeSection === id
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-300 font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Header */}
            <div className="text-center mb-10 space-y-3">
              <Badge variant="outline" className="mb-2 text-xs">
                About MEASURE Labs
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Making Corporate Accountability
                <br />
                <span className="relative inline-block pb-2">
                  <span className="relative z-10">Transparent and Accessible</span>
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-600/40 dark:to-yellow-500/40 -z-0"
                    style={{
                      transform: 'scaleX(1)',
                      transformOrigin: 'left'
                    }}
                  />
                </span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                MEASURE Labs tracks corporate DEI stances, commitments, and changes over time—transforming scattered information into verified intelligence that anyone can access.
              </p>

              {/* Dev, API Docs, and Methodology Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Link
                  href="/dev"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 dark:bg-violet-700 hover:opacity-90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Code className="h-4 w-4" />
                  Dev
                </Link>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:opacity-90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  API Docs
                </a>
                <Link
                  href="/methodology"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:opacity-90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Methodology
                </Link>
              </div>
            </div>

            {/* The Problem */}
            <Card id="problem" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                  The Problem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Companies make bold DEI commitments. Some companies follow through. Others scale back quietly, hoping no one notices. Until now, tracking who's actually committed versus who's just committed to the appearance of commitment required hours of research, legal expertise, and constant monitoring.
                </p>
                <p className="font-medium text-foreground">
                  The result?
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-sm">
                  <li>Consumers lack the information to make values-aligned choices</li>
                  <li>Investors can't assess reputational risk</li>
                  <li>Advocates can't hold companies accountable</li>
                  <li>Corporations face no systematic pressure to maintain their commitments</li>
                </ul>
              </CardContent>
            </Card>

            {/* Our Solution */}
            <Card id="solution" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                  Our Solution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  MEASURE Labs aggregates and verifies corporate DEI commitments from{' '}
                  <span className="font-semibold text-foreground">
                    {loading ? '...' : stats ? stats.total_companies.toLocaleString() : '360'} companies
                  </span>{' '}
                  across{' '}
                  <span className="font-semibold text-foreground">
                    {loading ? '...' : stats ? stats.industries_covered : '11'} industries
                  </span>
                  , synthesizing{' '}
                  <span className="font-semibold text-foreground">
                    {loading ? '...' : stats ? stats.total_sources.toLocaleString() : '3,486'} data sources
                  </span>{' '}
                  and{' '}
                  <span className="font-semibold text-foreground">
                    {loading ? '...' : stats ? stats.total_commitments.toLocaleString() : '1,101'} commitments
                  </span>{' '}
                  into a single, searchable platform.
                </p>

                <div className="space-y-2">
                  <p className="font-medium text-foreground text-sm">We track:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg">
                      <Target className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-xs">Public Commitments</p>
                        <p className="text-xs">CEO pledges, equity initiatives, coalition participation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-xs">Structural Accountability</p>
                        <p className="text-xs">Chief Diversity Officers, executive compensation tied to DEI goals</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg">
                      <Eye className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-xs">Transparency Levels</p>
                        <p className="text-xs">How openly companies report progress</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-xs">Risk Indicators</p>
                        <p className="text-xs">Lawsuits, controversies, scaling back</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg md:col-span-2">
                      <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-xs">Industry Benchmarks and Trends</p>
                        <p className="text-xs">Comparative analysis across sectors</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm">
                  Our methodology combines automated data collection with human verification, assigning each company a commitment strength score, transparency rating, and risk assessment—updated continuously as new information emerges.
                </p>
              </CardContent>
            </Card>

            {/* Who This Serves */}
            <Card id="serves" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  Who This Serves
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground text-sm">Consumers</h4>
                    <p className="text-xs text-muted-foreground">
                      Who want to support companies that actually advance equity—not just those with the best PR.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground text-sm">Investors</h4>
                    <p className="text-xs text-muted-foreground">
                      Assessing reputational risk, regulatory exposure, and long-term value alignment.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground text-sm">Advocates & Nonprofits</h4>
                    <p className="text-xs text-muted-foreground">
                      Tracking corporate accountability and identifying targets for pressure campaigns.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground text-sm">Journalists</h4>
                    <p className="text-xs text-muted-foreground">
                      Investigating the gap between corporate rhetoric and action.
                    </p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <h4 className="font-semibold text-foreground text-sm">HR Professionals & Job Seekers</h4>
                    <p className="text-xs text-muted-foreground">
                      Evaluating whether companies' internal cultures match their external promises.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why It Matters */}
            <Card id="matters" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-violet-600 dark:text-violet-500" />
                  Why It Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  DEI commitments aren't just moral positions—they're material business decisions with legal, financial, and reputational consequences. When AbbVie faces a genetic information privacy class action lawsuit, or when Amazon publicly retreats from DEI commitments during a CEO transition, these aren't isolated incidents. They're patterns that become visible only when someone's watching.
                </p>
                <p className="text-base font-semibold text-foreground text-center py-3">
                  We're watching.
                </p>
              </CardContent>
            </Card>

            {/* Our Approach */}
            <Card id="approach" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                  Our Approach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  We believe accountability requires three things: <span className="font-semibold text-foreground">visibility</span>, <span className="font-semibold text-foreground">verification</span>, and <span className="font-semibold text-foreground">accessibility</span>.
                </p>

                <div className="space-y-3 mt-4">
                  <div className="border-l-4 border-violet-600 dark:border-violet-400 pl-3 py-1.5">
                    <h4 className="font-semibold text-foreground mb-0.5 text-sm">Visibility</h4>
                    <p className="text-xs">
                      No more digging through obscure proxy statements or parsing carefully worded press releases. Everything in one place.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-600 dark:border-blue-400 pl-3 py-1.5">
                    <h4 className="font-semibold text-foreground mb-0.5 text-sm">Verification</h4>
                    <p className="text-xs">
                      We cite every source. Our AI Executive Summaries synthesize multiple data points, but you can always click through to the original documents.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-600 dark:border-green-400 pl-3 py-1.5">
                    <h4 className="font-semibold text-foreground mb-0.5 text-sm">Accessibility</h4>
                    <p className="text-xs">
                      This information shouldn't require a Bloomberg terminal or a legal team. It should be free, searchable, and designed for anyone who cares.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card id="next" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
                  What's Next
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Corporate accountability isn't a one-time audit—it's an ongoing process. As we expand our database and refine our methodology, we're building tools for:
                </p>

                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <span className="text-xs">Real-time alerts when companies change their commitments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <span className="text-xs">Comparative analysis across industries and competitors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <span className="text-xs">Public APIs for researchers, journalists, and advocacy organizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <span className="text-xs">Deeper integration of financial data and ESG metrics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Closing Statement */}
            <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/50 dark:to-blue-950/50">
              <CardContent className="py-6 text-center space-y-3">
                <p className="text-sm font-medium text-foreground leading-relaxed max-w-2xl mx-auto">
                  MEASURE Labs isn't just a database. It's infrastructure for a more transparent economy—one where companies can't quietly abandon commitments without consequence, and where the public has the tools to hold them accountable.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <Link
                    href="/companies"
                    className="px-5 py-2.5 bg-violet-600 dark:bg-violet-700 hover:opacity-90 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Explore Companies
                  </Link>
                  <Link
                    href="/analytics"
                    className="px-5 py-2.5 bg-white dark:bg-gray-800 hover:opacity-90 text-foreground rounded-lg text-sm font-semibold transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    View Analytics
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
