'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api, FullProfile } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate, getRiskLevelColor, getStatusBadgeColor, getRecommendationColor, getDEIStatusColor, getRatingColor, formatIndustry } from '@/lib/utils'
import { Building2, Calendar, TrendingUp, AlertTriangle, Users, FileText, Target, ShieldAlert, Sparkles, ExternalLink, Zap, Package } from 'lucide-react'
import { EventsList } from '@/components/events-list'
import { SupplierDiversityCard } from '@/components/supplier-diversity-card'

export default function CompanyPage() {
  const params = useParams()
  const [profile, setProfile] = useState<FullProfile | null>(null)
  const [fullCommitments, setFullCommitments] = useState<any[]>([])
  const [fullControversies, setFullControversies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [activeSection, setActiveSection] = useState('overview-section')

  useEffect(() => {
    if (params.id) {
      loadProfile(params.id as string)
    }
  }, [params.id])

  const loadProfile = async (id: string) => {
    try {
      setLoading(true)
      const data = await api.getLatestProfileForCompany(id)
      setProfile(data)

      // Fetch full commitment details for each commitment
      if (data.commitments && data.commitments.length > 0) {
        const commitmentIds = data.commitments.map((c: any) => c.id)
        await loadFullCommitments(commitmentIds)
      }

      // Fetch full controversy details for each controversy
      if (data.controversies && data.controversies.length > 0) {
        const controversyIds = data.controversies.map((c: any) => c.id)
        await loadFullControversies(controversyIds)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to extract readable title from URL
  const getSourceDisplayName = (source: any): string => {
    if (source.title) return source.title
    if (source.url) {
      // Extract domain from URL (e.g., "campusreform.org" from full URL)
      const domain = source.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
      return domain
    }
    return source.source_type?.replace(/_/g, ' ') || 'Source'
  }

  const loadFullCommitments = async (commitmentIds: string[]) => {
    try {
      // Fetch each commitment's full details using API client
      const fullData = await Promise.all(
        commitmentIds.map(id =>
          api.getCommitmentById(id)
            .catch(err => {
              console.error(`Failed to load commitment ${id}:`, err)
              return null
            })
        )
      )
      const filtered = fullData.filter(c => c !== null)
      console.log('Full commitments loaded:', filtered)
      console.log('First commitment sources:', filtered[0]?.sources)
      setFullCommitments(filtered)
    } catch (error) {
      console.error('Failed to load full commitments:', error)
    }
  }

  const loadFullControversies = async (controversyIds: string[]) => {
    try {
      // Fetch each controversy's full details using API client
      const fullData = await Promise.all(
        controversyIds.map(id =>
          api.getControversyById(id)
            .catch(err => {
              console.error(`Failed to load controversy ${id}:`, err)
              return null
            })
        )
      )
      setFullControversies(fullData.filter(c => c !== null))
    } catch (error) {
      console.error('Failed to load full controversies:', error)
    }
  }

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview-section',
        'commitments-section',
        'events-section',
        'controversies-section',
        'supplier-section',
        'risk-section',
        'sources-section'
      ]

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Check if section is in viewport (accounting for header)
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="animate-pulse space-y-8">
            <div className="h-40 bg-muted/50 rounded-xl backdrop-blur-sm" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted/50 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-muted/50 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <Card className="border-muted/40">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Company profile not found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const {
    company,
    commitments = [],
    controversies = [],
    events = [],
    sources = [],  // API returns 'sources' not 'data_sources'
    data_sources = sources,  // Fallback for compatibility
    cdo_roles = [],
    risk_assessments = [],
    ai_contexts = [],
    ai_context,  // API returns singular
    risk_assessment,  // API returns singular
    cdo_role,  // API returns singular
    dei_posture,  // DEI posture with evidence summary
    supplier_diversity,  // Supplier diversity program
    key_insights = [],  // AI-generated key insights
    strategic_implications = [],  // AI-generated strategic implications
    commitment_count = 0,
    controversy_count = 0,
    event_count = 0
  } = profile || {}

  // Use sources if data_sources is empty
  const dataSources = (data_sources && data_sources.length > 0) ? data_sources : sources

  // Create source lookup map by source_id for provenance linking
  const sourceMap = new Map<string, any>()
  dataSources.forEach((source: any) => {
    if (source.source_id) {
      sourceMap.set(source.source_id, source)
    }
  })

  // Handle both singular and plural formats
  const aiContext = ai_context || (ai_contexts && ai_contexts.length > 0 ? ai_contexts[0] : null)
  const riskAssessment = risk_assessment || (risk_assessments && risk_assessments.length > 0 ? risk_assessments[0] : null)
  const cdoRole = cdo_role || (cdo_roles && cdo_roles.length > 0 ? cdo_roles[0] : null)

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <Card className="border-muted/40">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Company information not found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Get section name for breadcrumb
  const getSectionName = (sectionId: string) => {
    const names: Record<string, string> = {
      'overview-section': 'Overview',
      'commitments-section': 'Commitments',
      'events-section': 'Events',
      'controversies-section': 'Controversies',
      'supplier-section': 'Supplier Diversity',
      'risk-section': 'Risk Assessment',
      'sources-section': 'Sources'
    }
    return names[sectionId] || 'Overview'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">

      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            {company.logo_url ? (
              <div className="relative">
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="h-16 w-16 rounded-md object-cover ring-1 ring-border/50"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center ring-1 ring-border/50">
                <Building2 className="h-8 w-8 text-muted-foreground/70" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {company.name}
                </h1>
                {dei_posture?.status && (
                  <Badge
                    variant={getDEIStatusColor(dei_posture.status) as any}
                    className="text-sm font-semibold"
                  >
                    {dei_posture.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {company.ticker && (
                  <span className="px-2 py-0.5 rounded bg-muted border border-border/40 font-mono font-medium text-foreground/90">
                    {company.ticker}
                  </span>
                )}
                <span className="text-muted-foreground flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                  {formatIndustry(company.industry)}
                </span>
                {(company.hq_city || company.hq_state || company.hq_country) && (
                  <span className="text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    {[company.hq_city, company.hq_state, company.hq_country].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:border-border text-sm font-medium"
              >
                <span>Visit Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div
              onClick={() => {
                const element = document.getElementById('sources-section')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="rounded-md border border-border bg-card p-4 cursor-pointer hover:bg-accent/50 hover:border-accent-foreground/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Sources</p>
                  <FileText className="h-4 w-4 text-muted-foreground/50" />
                </div>
                <p className="text-2xl font-bold">{profile.source_count}</p>
              </div>
            </div>

            <div
              onClick={() => {
                const element = document.getElementById('commitments-section')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="rounded-md border border-border bg-card p-4 cursor-pointer hover:bg-accent/50 hover:border-accent-foreground/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Commitments</p>
                  <Target className="h-4 w-4 text-muted-foreground/50" />
                </div>
                <p className="text-2xl font-bold">{commitment_count || commitments.length}</p>
              </div>
            </div>

            <div
              onClick={() => {
                const element = document.getElementById('events-section')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="rounded-md border border-border bg-card p-4 cursor-pointer hover:bg-accent/50 hover:border-accent-foreground/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Events</p>
                  <Zap className="h-4 w-4 text-muted-foreground/50" />
                </div>
                <p className="text-2xl font-bold">{event_count || events.length}</p>
              </div>
            </div>

            <div
              onClick={() => {
                const element = document.getElementById('controversies-section')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="rounded-md border border-border bg-card p-4 cursor-pointer hover:bg-accent/50 hover:border-accent-foreground/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Controversies</p>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground/50" />
                </div>
                <p className="text-2xl font-bold">{controversy_count || controversies.length}</p>
              </div>
            </div>

            {riskAssessment && (
              <div
                onClick={() => {
                  const element = document.getElementById('risk-section')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="rounded-md border border-border bg-card p-4 cursor-pointer hover:bg-accent/50 hover:border-accent-foreground/20 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Risk Level</p>
                    <ShieldAlert className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                  <Badge
                    variant={getRiskLevelColor(riskAssessment.risk_level) as any}
                    className="text-sm font-medium px-2 py-0.5"
                  >
                    {riskAssessment.risk_level?.toLowerCase() === 'medium' ? 'Mid Risk' :
                     riskAssessment.risk_level?.toLowerCase() === 'low' ? 'Low Risk' :
                     riskAssessment.risk_level?.toLowerCase() === 'high' ? 'High Risk' :
                     riskAssessment.risk_level?.toLowerCase() === 'critical' ? 'Critical Risk' :
                     riskAssessment.risk_level}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Summary */}
        {aiContext && aiContext.executive_summary && (
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                AI Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-muted-foreground leading-relaxed text-sm">
                {aiContext.executive_summary}
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                {aiContext.commitment_strength_rating !== null && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/40">
                    <span className="text-sm font-medium text-muted-foreground">Commitment Strength</span>
                    <Badge variant={getRatingColor(aiContext.commitment_strength_rating) as any} className="font-semibold">
                      {aiContext.commitment_strength_rating}/10
                    </Badge>
                  </div>
                )}
                {aiContext.transparency_rating !== null && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/40">
                    <span className="text-sm font-medium text-muted-foreground">Transparency</span>
                    <Badge variant={getRatingColor(aiContext.transparency_rating) as any} className="font-semibold">
                      {aiContext.transparency_rating}/10
                    </Badge>
                  </div>
                )}
                {aiContext.recommendation && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/40">
                    <span className="text-sm font-medium text-muted-foreground">Grade</span>
                    <Badge
                      variant={getRecommendationColor(aiContext.recommendation) as any}
                      className="font-semibold"
                    >
                      {aiContext.recommendation.replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  </div>
                )}
                {dei_posture?.status && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/40">
                    <span className="text-sm font-medium text-muted-foreground">Current DEI Status</span>
                    <Badge
                      variant={getDEIStatusColor(dei_posture.status) as any}
                      className="font-semibold"
                    >
                      {dei_posture.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  </div>
                )}
              </div>

              {/* CDO Information */}
              {cdoRole && (
                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Chief Diversity Officer</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {cdoRole.name && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</span>
                        <p className="text-sm font-medium">{cdoRole.name}</p>
                      </div>
                    )}
                    {cdoRole.title && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</span>
                        <p className="text-sm font-medium">{cdoRole.title}</p>
                      </div>
                    )}
                    {cdoRole.reports_to && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reports To</span>
                        <p className="text-sm font-medium">{cdoRole.reports_to}</p>
                      </div>
                    )}
                    {cdoRole.appointment_date && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Appointed</span>
                        <p className="text-sm font-medium">{formatDate(cdoRole.appointment_date)}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={cdoRole.exists ? 'green' : 'gray'} className="font-medium">
                      {cdoRole.exists ? 'Active' : 'Not Established'}
                    </Badge>
                    {cdoRole.c_suite_member !== undefined && (
                      <Badge variant={cdoRole.c_suite_member ? 'green' : 'outline'} className="font-medium">
                        {cdoRole.c_suite_member ? 'C-Suite Member' : 'Not C-Suite'}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Content Layout with TOC */}
        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
          {/* Table of Contents - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="sticky top-[80px] space-y-4">
              {/* Company Details */}
              <div className="pb-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground mb-1">{company?.name}</h3>
                {company?.ticker && (
                  <p className="text-xs font-mono text-muted-foreground">{company.ticker}</p>
                )}
                {company?.industry && (
                  <p className="text-xs text-muted-foreground mt-1">{formatIndustry(company.industry)}</p>
                )}
              </div>

              {/* Navigation */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">On This Page</p>
                <nav className="space-y-1">
                  <a
                    href="#overview-section"
                    className={`block py-1.5 px-2 text-sm rounded transition-colors ${
                      activeSection === 'overview-section'
                        ? 'text-foreground bg-accent font-medium border-l-2 border-primary pl-1.5'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Overview
                  </a>
                  <a
                    href="#commitments-section"
                    className={`block py-1.5 px-2 text-sm rounded transition-colors ${
                      activeSection === 'commitments-section'
                        ? 'text-foreground bg-accent font-medium border-l-2 border-primary pl-1.5'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Commitments
                  </a>
                  <a
                    href="#events-section"
                    className={`block py-1.5 px-2 text-sm rounded transition-colors ${
                      activeSection === 'events-section'
                        ? 'text-foreground bg-accent font-medium border-l-2 border-primary pl-1.5'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Events
                  </a>
                  <a
                    href="#controversies-section"
                    className={`block py-1.5 px-2 text-sm rounded transition-colors ${
                      activeSection === 'controversies-section'
                        ? 'text-foreground bg-accent font-medium border-l-2 border-primary pl-1.5'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Controversies
                  </a>
                  {supplier_diversity && (
                    <a
                      href="#supplier-section"
                      className={`block py-1.5 px-2 text-sm rounded transition-colors ${
                        activeSection === 'supplier-section'
                          ? 'text-foreground bg-accent font-medium border-l-2 border-primary pl-1.5'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Supplier Diversity
                    </a>
                  )}
                  {riskAssessment && (
                    <a
                      href="#risk-section"
                      className={`block py-1.5 px-2 text-sm rounded transition-colors ${
                        activeSection === 'risk-section'
                          ? 'text-foreground bg-accent font-medium border-l-2 border-primary pl-1.5'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Risk Assessment
                    </a>
                  )}
                  <a
                    href="#sources-section"
                    className={`block py-1.5 px-2 text-sm rounded transition-colors ${
                      activeSection === 'sources-section'
                        ? 'text-foreground bg-accent font-medium border-l-2 border-primary pl-1.5'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sources
                  </a>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Overview Section */}
            <section id="overview-section" className="scroll-mt-20 space-y-4">
            {aiContext?.trend_analysis && (
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <div className="p-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                      <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed text-sm">
                    {aiContext.trend_analysis}
                  </div>
                </CardContent>
              </Card>
            )}

            {profile.overall_stance && (
              <Card className="border-border bg-violet-50/50 dark:bg-violet-950/20">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Overall DEI Stance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{profile.overall_stance}</p>
                </CardContent>
              </Card>
            )}

            {profile.key_actions && profile.key_actions.length > 0 && (
              <Card className="border-border bg-emerald-50/50 dark:bg-emerald-950/20">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Key Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {profile.key_actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Target className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-muted-foreground leading-relaxed flex-1">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* DEI Evidence Summary */}
            {dei_posture?.evidence_summary && (
              <Card className="border-border bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">DEI Evidence Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed text-sm">
                    {dei_posture.evidence_summary}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Industry Comparison */}
            {aiContext?.comparative_context && (
              <Card className="border-border bg-green-50/50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Industry Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed text-sm">
                    {aiContext.comparative_context}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Insights - Full Width */}
            {key_insights && key_insights.length > 0 && (
              <Card className="border-border bg-rose-50/50 dark:bg-rose-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {key_insights.map((insight: any, i) => (
                      <li key={insight.id || i} className="flex items-start gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground leading-relaxed flex-1">{insight.insight_text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Strategic Implications - Full Width */}
            {strategic_implications && strategic_implications.length > 0 && (
              <Card className="border-border bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Strategic Implications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {strategic_implications.map((implication: any, i) => (
                      <li key={implication.id || i} className="flex items-start gap-3 text-sm">
                        <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">{i + 1}</span>
                        </div>
                        <span className="text-muted-foreground leading-relaxed flex-1">{implication.implication_text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {profile.recent_changes && (
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Recent Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{profile.recent_changes}</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Commitments Section */}
          <section id="commitments-section" className="scroll-mt-20 space-y-4">
            <h2 className="text-2xl font-bold pt-8">Commitments</h2>
            {fullCommitments && fullCommitments.length > 0 ? (
              fullCommitments.map((commitment, idx) => (
                <Card
                  key={commitment.id}
                  className="border-border"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold leading-tight mb-1.5">
                          {(commitment as any).commitment_name || 'Untitled Commitment'}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-0.5 rounded bg-muted border border-border font-medium">
                            {commitment.commitment_type ? commitment.commitment_type.replace(/_/g, ' ') : 'N/A'}
                          </span>
                          {(commitment as any).status_changed_at && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              Updated {formatDate((commitment as any).status_changed_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={getStatusBadgeColor(commitment.current_status) as any}
                        className="shrink-0 font-medium"
                      >
                        {commitment.current_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {commitment.quotes && commitment.quotes.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Supporting Evidence</h4>
                        {commitment.quotes.map((quote: any, idx: number) => (
                          <blockquote
                            key={idx}
                            className="border-l-2 border-blue-500/40 pl-4 py-2 text-sm text-muted-foreground bg-blue-500/5 rounded-r"
                          >
                            <span className="text-blue-500/60 mr-1">&ldquo;</span>
                            {typeof quote === 'string' ? quote : quote?.text || JSON.stringify(quote)}
                            <span className="text-blue-500/60 ml-1">&rdquo;</span>
                          </blockquote>
                        ))}
                      </div>
                    )}

                    {(commitment as any).sources && (commitment as any).sources.length > 0 && (
                      <div className="p-4 bg-muted/30 rounded-md border border-border/40">
                        <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider">
                          Sources ({(commitment as any).sources.length})
                        </h4>
                        <div className="space-y-2">
                          {(commitment as any).sources.map((source: any, idx: number) => (
                            <div key={idx} className="flex items-start justify-between gap-2">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-xs font-medium inline-flex items-center gap-1 group/link"
                              >
                                <FileText className="h-3 w-3 shrink-0" />
                                <span className="line-clamp-1">{getSourceDisplayName(source)}</span>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                              </a>
                              {source.reliability_score && (
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {source.reliability_score}/5
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {commitment.status_changed_at && (
                      <div className="pt-2 text-xs text-muted-foreground border-t border-border/40">
                        Status updated {formatDate(commitment.status_changed_at)}
                        {commitment.previous_status && ` (was: ${commitment.previous_status})`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">No commitments recorded</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Events Section */}
          <section id="events-section" className="scroll-mt-20 space-y-4">
            <h2 className="text-2xl font-bold pt-8">Events</h2>
            <EventsList events={events} />
          </section>

          {/* Controversies Section */}
          <section id="controversies-section" className="scroll-mt-20 space-y-4">
            <h2 className="text-2xl font-bold pt-8">Controversies</h2>
            {fullControversies && fullControversies.length > 0 ? (
              fullControversies.map((controversy, idx) => (
                <Card
                  key={controversy.id}
                  className="border-border"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold leading-tight mb-1.5 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                          <span className="flex-1">
                            {controversy.case_name || controversy.title || 'Untitled Controversy'}
                          </span>
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground ml-6">
                          <span className="px-2 py-0.5 rounded bg-muted border border-border font-medium">
                            {(controversy.type || controversy.controversy_type) ? (controversy.type || controversy.controversy_type).replace(/_/g, ' ') : 'N/A'}
                          </span>
                          {controversy.date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              {formatDate(controversy.date)}
                            </span>
                          )}
                        </div>
                      </div>
                      {controversy.status && (
                        <Badge
                          variant={getRiskLevelColor(controversy.status) as any}
                          className="shrink-0 font-medium"
                        >
                          {controversy.status.replace(/_/g, ' ')}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {controversy.description && (
                      <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                        {controversy.description}
                      </p>
                    )}

                    {(controversy.court || controversy.docket_number || controversy.nlrb_case_id) && (
                      <div className="p-4 bg-muted/30 rounded-lg border border-border/40 space-y-2 text-sm">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">Legal Details</h4>
                        {controversy.court && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-20">Court:</span>
                            <span className="text-foreground">{controversy.court}</span>
                          </div>
                        )}
                        {controversy.docket_number && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-20">Docket #:</span>
                            <span className="text-foreground font-mono text-xs">{controversy.docket_number}</span>
                          </div>
                        )}
                        {controversy.nlrb_case_id && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-20">NLRB Case:</span>
                            <span className="text-foreground font-mono text-xs">{controversy.nlrb_case_id}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {controversy.quotes && controversy.quotes.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Key Evidence</h4>
                        {controversy.quotes.map((quote: any, idx: number) => (
                          <blockquote
                            key={idx}
                            className="border-l-2 border-destructive/40 pl-4 py-2 text-sm text-muted-foreground bg-destructive/5 rounded-r"
                          >
                            <span className="text-destructive/60 mr-1">&ldquo;</span>
                            {typeof quote === 'string' ? quote : quote?.text || JSON.stringify(quote)}
                            <span className="text-destructive/60 ml-1">&rdquo;</span>
                          </blockquote>
                        ))}
                      </div>
                    )}

                    {(controversy as any).sources && (controversy as any).sources.length > 0 && (
                      <div className="p-4 bg-muted/30 rounded-md border border-border/40">
                        <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider">
                          Sources ({(controversy as any).sources.length})
                        </h4>
                        <div className="space-y-2">
                          {(controversy as any).sources.map((source: any, idx: number) => (
                            <div key={idx} className="flex items-start justify-between gap-2">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-xs font-medium inline-flex items-center gap-1 group/link"
                              >
                                <FileText className="h-3 w-3 shrink-0" />
                                <span className="line-clamp-1">{getSourceDisplayName(source)}</span>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                              </a>
                              {source.reliability_score && (
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {source.reliability_score}/5
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {controversy.filing_url && (
                      <div className="pt-2 border-t border-border/40">
                        <a
                          href={controversy.filing_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm inline-flex items-center gap-2 font-medium group/filing"
                        >
                          <span>View Court Filing</span>
                          <ExternalLink className="h-4 w-4 transition-transform group-hover/filing:translate-x-0.5 group-hover/filing:-translate-y-0.5" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">No controversies recorded</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Supplier Diversity Section */}
          {supplier_diversity && (
            <section id="supplier-section" className="scroll-mt-20 space-y-4">
              <h2 className="text-2xl font-bold pt-8">Supplier Diversity</h2>
              <SupplierDiversityCard supplierDiversity={supplier_diversity} />
            </section>
          )}

          {/* Risk Assessment Section */}
          {riskAssessment && (
            <section id="risk-section" className="scroll-mt-20 space-y-4">
              <h2 className="text-2xl font-bold pt-8">Risk Assessment</h2>
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Assessed on {formatDate(profile.research_captured_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Note:</strong> The risk score represents potential DEI-related risks.
                        Higher scores (closer to 100) indicate <strong className="text-foreground">higher risk</strong> based on lawsuits, controversies, and negative events.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Risk Score</p>
                        <p className="text-3xl font-bold text-destructive">
                          {riskAssessment.overall_risk_score}
                          <span className="text-base text-muted-foreground">/100</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Higher = More Risk</p>
                      </div>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Risk Level</p>
                        <Badge
                          variant={getRiskLevelColor(riskAssessment.risk_level) as any}
                          className="text-sm font-medium px-2 py-0.5"
                        >
                          {riskAssessment.risk_level?.toLowerCase() === 'medium' ? 'Mid Risk' :
                           riskAssessment.risk_level?.toLowerCase() === 'low' ? 'Low Risk' :
                           riskAssessment.risk_level?.toLowerCase() === 'high' ? 'High Risk' :
                           riskAssessment.risk_level?.toLowerCase() === 'critical' ? 'Critical Risk' :
                           riskAssessment.risk_level}
                        </Badge>
                      </div>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Ongoing Lawsuits</p>
                        <p className="text-2xl font-bold">{riskAssessment.ongoing_lawsuits}</p>
                      </div>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Settled Cases</p>
                        <p className="text-2xl font-bold">{riskAssessment.settled_cases}</p>
                      </div>
                    </div>
                  </div>

                  {(riskAssessment.negative_events || (riskAssessment as any).high_impact_events) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {riskAssessment.negative_events !== undefined && (
                        <div className="rounded-md border border-border bg-card p-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Negative Events</p>
                            <p className="text-2xl font-bold">{riskAssessment.negative_events}</p>
                          </div>
                        </div>
                      )}
                      {(riskAssessment as any).high_impact_events !== undefined && (
                        <div className="rounded-md border border-border bg-card p-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">High Impact Events</p>
                            <p className="text-2xl font-bold">{(riskAssessment as any).high_impact_events}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {riskAssessment.assessment_notes && (
                    <div className="pt-6 border-t border-border/40">
                      <h4 className="text-sm font-semibold mb-3">Assessment Notes</h4>
                      <div className="text-muted-foreground leading-relaxed text-sm">
                        {riskAssessment.assessment_notes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {/* Sources Section */}
          <section id="sources-section" className="scroll-mt-20 space-y-4">
            <h2 className="text-2xl font-bold pt-8">Sources</h2>
            {dataSources && dataSources.length > 0 ? (
              dataSources.map((source, idx) => (
                <div
                  key={source.id}
                  className="border border-border rounded-md px-3 py-2 bg-card/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs font-medium leading-tight truncate">{getSourceDisplayName(source)}</span>
                        {source.reliability_score !== null && (
                          <Badge variant="outline" className="shrink-0 font-medium text-[10px] px-1 py-0">
                            {source.reliability_score}/10
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-5">
                        <span className="px-1.5 py-0 rounded bg-muted border border-border font-medium text-[10px]">
                          {source.source_type ? source.source_type.replace(/_/g, ' ') : 'N/A'}
                        </span>
                        {((source as any).date || source.published_date) && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Calendar className="h-2.5 w-2.5" />
                            {formatDate((source as any).date || source.published_date)}
                          </span>
                        )}
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-[10px] inline-flex items-center gap-1 font-medium ml-auto"
                        >
                          <span>View</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">No sources available</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
          </div>
        </div>
      </div>
    </div>
  )
}
