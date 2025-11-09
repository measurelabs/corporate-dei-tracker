'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Database, TrendingUp, Shield, Search, AlertCircle, CheckCircle2, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'executive-summary', label: 'Executive Summary' },
  { id: 'research-objectives', label: 'Research Objectives' },
  { id: 'data-collection', label: 'Data Collection Methodology' },
  { id: 'research-schema', label: 'Research Schema & Standards' },
  { id: 'ai-powered', label: 'AI-Powered Profile Generation' },
  { id: 'risk-assessment', label: 'Risk Assessment Framework' },
  { id: 'database-architecture', label: 'Database Architecture' },
  { id: 'quality-assurance', label: 'Quality Assurance' },
  { id: 'automation-pipeline', label: 'Automation Pipeline' },
  { id: 'limitations', label: 'Limitations & Considerations' },
]

export default function MethodologyPage() {
  const [activeSection, setActiveSection] = useState('executive-summary')

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20">
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
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <Badge variant="outline" className="mb-3 text-xs">
                Research Documentation
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                MEASURE Index Research Methodology
              </h1>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span><strong>Version:</strong> 1.0</span>
                <span><strong>Date:</strong> November 2, 2025</span>
                <span><strong>Project:</strong> Corporate DEI Posture Analysis & Database System</span>
              </div>
            </div>

            {/* Executive Summary */}
            <Card id="executive-summary" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  This methodology document outlines the comprehensive, systematic approach used to research, analyze, and catalog Diversity, Equity, and Inclusion (DEI) postures for S&P 500 companies. The system combines automated web research, AI-powered contextual analysis, quantitative risk scoring, and structured database storage to create an authoritative, scalable, and queryable repository of corporate DEI intelligence.
                </p>

                <div className="bg-muted/50 rounded-lg p-4 mt-3 space-y-2">
                  <p className="font-semibold text-foreground text-sm">Key Components:</p>
                  <ul className="space-y-1.5 text-xs">
                    <li><strong>Automated Research Pipeline:</strong> Multi-source web research using Anthropic's Batch API with integrated web search</li>
                    <li><strong>Structured Data Schema:</strong> JSON-based research format with comprehensive provenance tracking</li>
                    <li><strong>AI Contextualization:</strong> Claude-powered analytical insights and strategic implications</li>
                    <li><strong>Risk Quantification:</strong> Algorithmic scoring based on legal controversies and negative events</li>
                    <li><strong>Relational Database:</strong> PostgreSQL-backed normalized schema with 15 tables and analytical views</li>
                    <li><strong>Quality Controls:</strong> Multi-layer validation, source reliability scoring, and data quality flagging</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Research Objectives */}
            <Card id="research-objectives" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-violet-600 dark:text-violet-500" />
                  Research Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Primary Goals:</p>
                  <ol className="space-y-1.5 list-decimal list-inside text-xs">
                    <li><strong>Comprehensive Coverage:</strong> Document DEI posture for all S&P 500 companies</li>
                    <li><strong>Multi-Dimensional Analysis:</strong> Capture leadership, policies, controversies, commitments, and transparency</li>
                    <li><strong>Evidence-Based Research:</strong> Require minimum 5 credible sources per company with full citations</li>
                    <li><strong>Temporal Tracking:</strong> Focus on current state (2024-2025) while capturing historical trajectory</li>
                    <li><strong>Actionable Intelligence:</strong> Provide strategic insights for stakeholders (investors, advocates, researchers)</li>
                  </ol>
                </div>

                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Research Scope:</p>
                  <p className="text-xs mb-2">Each company analysis includes:</p>
                  <ul className="space-y-1.5 text-xs list-disc list-inside">
                    <li><strong>DEI Posture & Status:</strong> Current commitment level and strategic positioning</li>
                    <li><strong>Leadership Structure:</strong> Chief Diversity Officer (CDO) role, reporting lines, C-suite representation</li>
                    <li><strong>Transparency & Reporting:</strong> Publication practices, disclosure frequency, report availability</li>
                    <li><strong>Recent Events:</strong> Policy changes, announcements, awards, and milestones (2024-2025)</li>
                    <li><strong>Legal Controversies:</strong> Ongoing lawsuits, settlements, regulatory actions, employee protests</li>
                    <li><strong>Commitments & Initiatives:</strong> Industry coalitions, pledges, programs, and philanthropic efforts</li>
                    <li><strong>Supplier Diversity:</strong> Program existence, status, and spending disclosure</li>
                    <li><strong>Comparative Context:</strong> Industry peer positioning and relative maturity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection Methodology */}
            <Card id="data-collection" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-600 dark:text-green-500" />
                  Data Collection Methodology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Phase 1: Source Identification & Web Research</p>
                  <p className="text-xs mb-3"><strong>Approach:</strong> Anthropic Batch API with integrated web search capabilities</p>

                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-2">1.1 Input Data Sources</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li><strong>Primary Dataset:</strong> S&P 500 company list (sp500.csv)</li>
                        <li><strong>Fields Captured:</strong> Ticker symbol, company name, GICS sector/sub-industry, headquarters location, CIK number, founding year</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-2">1.2 Research Process</p>
                      <p className="text-xs mb-2"><strong>Tools:</strong> batch_api_launcher.py and submit_batch.py</p>
                      <ol className="space-y-2 text-xs list-decimal list-inside">
                        <li>
                          <strong>Request Generation:</strong>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li>Creates JSONL batch file with one research task per company</li>
                            <li>Each request includes comprehensive research prompt with 6 search objectives</li>
                            <li>Model: claude-sonnet-4-5-20250929 with 16,000 max tokens</li>
                            <li>Web search enabled: Up to 15 search queries per company</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Search Strategy (per company):</strong>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>DEI Posture Searches:</strong> Corporate DEI pages, ESG reports, annual reports</li>
                            <li><strong>Leadership Searches:</strong> CDO identification, LinkedIn profiles, press releases</li>
                            <li><strong>Transparency Searches:</strong> Standalone DEI reports, sustainability reports, 10-K/proxy statements</li>
                            <li><strong>Recent Events:</strong> News articles, press releases, policy announcements (2024-2025)</li>
                            <li><strong>Legal Controversies:</strong> Discrimination lawsuits, court dockets, SEC filings, regulatory actions</li>
                            <li><strong>Commitments:</strong> CEO Action pledge, industry coalitions, supplier diversity programs</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Source Requirements:</strong>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Minimum:</strong> 5 unique, credible sources per company</li>
                            <li><strong>Reliability Hierarchy:</strong>
                              <ul className="ml-4 mt-1 space-y-1">
                                <li><strong>5 (Highest):</strong> SEC filings, company websites, proxy statements</li>
                                <li><strong>4:</strong> Major news outlets (WSJ, NYT, Reuters, Bloomberg)</li>
                                <li><strong>3:</strong> Trade press, industry publications</li>
                                <li><strong>2:</strong> Think tanks, research organizations</li>
                                <li><strong>1:</strong> Blogs, social media</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <strong>Batch Processing:</strong>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li>Submitted to Anthropic Batch API for parallel processing</li>
                            <li>Processing window: Up to 24 hours</li>
                            <li>Cost efficiency: 50% discount vs. real-time API</li>
                            <li>Results downloaded as JSONL with one research JSON per company</li>
                          </ul>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Phase 2: Research Validation & Storage</p>
                  <p className="text-xs mb-2"><strong>Tool:</strong> download_batch_results.py</p>
                  <ul className="space-y-1 text-xs list-disc list-inside">
                    <li>Downloads completed batch results from Anthropic API</li>
                    <li>Parses JSONL responses and extracts research JSON from AI output</li>
                    <li>Validates against schema requirements</li>
                    <li>Saves individual research files: research_data/{'{TICKER}'}_research.json</li>
                    <li>Logs successes, failures, and validation errors</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Research Schema & Standards */}
            <Card id="research-schema" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                  Research Schema & Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p className="text-xs">All research outputs follow standardized JSON schema (v1.1)</p>

                <div className="bg-muted/50 rounded-lg p-3 mt-3 font-mono text-xs overflow-x-auto">
                  <pre>{`{
  "schema_version": "1.1",
  "company_identifier": {
    "ticker_symbol": "AAPL",
    "company_name": "Apple Inc.",
    "industry": "Information Technology"
  },
  "research_snapshot": {
    "captured_at": "ISO-8601 timestamp"
  },
  "data_sources": [...],
  "findings": {
    "dei_posture": {...},
    "cdo_role": {...},
    "reporting": {...},
    "events": [...],
    "controversies": [...],
    "commitments": [...]
  }
}`}</pre>
                </div>

                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Key Schema Features:</p>
                  <ul className="space-y-1 text-xs list-disc list-inside">
                    <li><strong>Provenance Tracking:</strong> Every finding includes provenance_ids array linking to source IDs</li>
                    <li><strong>Verbatim Quotes:</strong> Each section supports quotes array (max 240 chars per quote)</li>
                    <li><strong>Controlled Vocabularies:</strong> ENUMs for status fields, event types, controversy types, etc.</li>
                    <li><strong>Data Quality Metadata:</strong> Flags for incomplete data, conflicting sources, verification needs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Profile Generation */}
            <Card id="ai-powered" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                  AI-Powered Profile Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p className="text-xs"><strong>Tool:</strong> create_company_profile.py</p>

                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Phase 3: Profile Creation & AI Contextualization</p>
                  <p className="text-xs mb-2">Each research JSON is transformed into an enriched company profile through:</p>

                  <div className="space-y-2">
                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-2">AI Analysis Components:</p>
                      <ol className="space-y-1.5 text-xs list-decimal list-inside">
                        <li><strong>Executive Summary</strong> (150-250 words) - Comprehensive overview of DEI posture</li>
                        <li><strong>Key Insights</strong> (5-7 bullet points, 20-40 words each) - Critical observations</li>
                        <li><strong>Trend Analysis</strong> (100-150 words) - Momentum assessment and trajectory</li>
                        <li><strong>Comparative Context</strong> (100-150 words) - Industry peer comparison</li>
                        <li><strong>Strategic Implications</strong> (3-5 points, 25-50 words each) - Business risks and opportunities</li>
                        <li><strong>Commitment Strength Rating</strong> (1-10 scale)</li>
                        <li><strong>Transparency Rating</strong> (1-10 scale)</li>
                        <li><strong>Overall Recommendation</strong> - Leading, Strong, Moderate, Weak, or Concerning</li>
                      </ol>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-2">AI Prompt Design:</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>Provides research findings, risk assessment, and editorial summaries</li>
                        <li>Requests structured JSON output</li>
                        <li>Model: claude-sonnet-4-5-20250929 (4,000 max tokens)</li>
                        <li>Temperature: Standard (balanced creativity and accuracy)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment Framework */}
            <Card id="risk-assessment" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-500" />
                  Risk Assessment Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Quantitative Risk Scoring</p>
                  <p className="text-xs mb-2"><strong>Methodology:</strong> Event-based accumulation with weighted severity</p>

                  <div className="bg-muted/50 rounded-lg p-3 mt-3 space-y-2">
                    <p className="font-semibold text-foreground text-xs mb-1">Risk Factors & Weights:</p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-1 font-semibold">Factor</th>
                          <th className="text-center py-1 font-semibold">Weight</th>
                          <th className="text-left py-1 font-semibold">Rationale</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        <tr className="border-b border-border/50">
                          <td className="py-1">Ongoing Lawsuit</td>
                          <td className="text-center">15 points</td>
                          <td>Active legal exposure, unresolved risk</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-1">Settled Case</td>
                          <td className="text-center">5 points</td>
                          <td>Historical liability, reputational impact</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-1">Negative Event</td>
                          <td className="text-center">10 points</td>
                          <td>Public criticism, policy reversals, protests</td>
                        </tr>
                        <tr>
                          <td className="py-1">High-Impact Event</td>
                          <td className="text-center">5 points</td>
                          <td>Major announcements, significant controversies</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 mt-3 border border-blue-200 dark:border-blue-800">
                    <p className="font-semibold text-foreground text-xs mb-1">Calculation:</p>
                    <p className="font-mono text-xs">Risk Score = MIN(100, Σ(factor_count × factor_weight))</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground text-xs mb-1">Risk Level Thresholds:</p>
                    <ul className="space-y-1 text-xs">
                      <li><strong>0-24:</strong> Low risk</li>
                      <li><strong>25-49:</strong> Medium risk</li>
                      <li><strong>50-100:</strong> High risk</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-semibold text-foreground text-sm mb-2">Risk Score Bias Considerations</p>

                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800 space-y-3">
                    <div>
                      <p className="font-semibold text-foreground text-xs mb-2">Known Biases:</p>
                      <ol className="space-y-1.5 text-xs list-decimal list-inside">
                        <li><strong>Litigation bias:</strong> Larger companies face more lawsuits (exposure ≠ worse behavior)</li>
                        <li><strong>Transparency paradox:</strong> Companies disclosing issues may score higher risk than opaque peers</li>
                        <li><strong>Media bias:</strong> High-profile companies receive more coverage (detection bias)</li>
                      </ol>
                    </div>

                    <div>
                      <p className="font-semibold text-foreground text-xs mb-2">Mitigation:</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>Risk scores normalized by company size (optional view)</li>
                        <li>Transparency rating as separate dimension (rewarding disclosure)</li>
                        <li>Context fields capture case details beyond binary counts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database Architecture */}
            <Card id="database-architecture" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                  Database Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p className="text-xs"><strong>Tools:</strong> database/schema.sql, database/import_profiles.py</p>

                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Phase 4: PostgreSQL Database Import</p>

                  <div className="bg-muted/50 rounded-lg p-3 mt-3 space-y-2">
                    <p className="font-semibold text-foreground text-xs mb-1">Database Design Principles:</p>
                    <ol className="space-y-1 text-xs list-decimal list-inside">
                      <li><strong>Normalization:</strong> 3NF-compliant schema to eliminate redundancy</li>
                      <li><strong>Versioning:</strong> Support multiple profile snapshots per company</li>
                      <li><strong>Referential Integrity:</strong> Foreign key constraints across all relationships</li>
                      <li><strong>Performance:</strong> Comprehensive indexing on foreign keys, dates, ratings, and filter columns</li>
                      <li><strong>Type Safety:</strong> PostgreSQL ENUM types for controlled vocabularies</li>
                    </ol>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-foreground text-xs">15 Core Tables:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <ol className="space-y-0.5 list-decimal list-inside">
                          <li>companies</li>
                          <li>profiles</li>
                          <li>risk_assessments</li>
                          <li>dei_postures</li>
                          <li>cdo_roles</li>
                          <li>reporting_practices</li>
                          <li>events</li>
                          <li>controversies</li>
                        </ol>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <ol start={9} className="space-y-0.5 list-decimal list-inside">
                          <li>commitments</li>
                          <li>supplier_diversity</li>
                          <li>ai_contexts</li>
                          <li>ai_key_insights</li>
                          <li>ai_strategic_implications</li>
                          <li>data_sources</li>
                          <li>data_quality_flags</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-foreground text-xs">3 Analytical Views:</p>
                    <ul className="space-y-1 text-xs list-disc list-inside">
                      <li><strong>v_latest_company_profiles:</strong> Denormalized view of latest profile with key metrics</li>
                      <li><strong>v_risk_by_industry:</strong> Risk aggregation by industry sector</li>
                      <li><strong>v_cdo_stats:</strong> CDO prevalence and C-suite representation statistics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Assurance */}
            <Card id="quality-assurance" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                  Quality Assurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Multi-Layer Validation</p>

                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="font-semibold text-foreground text-xs mb-1">1. Schema Validation</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>JSON Schema Draft 7 specification</li>
                        <li>Required fields enforcement</li>
                        <li>Type checking (strings, integers, booleans, dates)</li>
                        <li>Pattern validation (ticker symbols, CIK numbers, URLs, dates)</li>
                        <li>Enum validation for controlled vocabularies</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-1">2. Source Reliability Scoring (5-Point Scale)</p>
                      <ul className="space-y-1 text-xs">
                        <li><strong>5:</strong> Primary corporate sources (SEC filings, corporate websites, proxy statements)</li>
                        <li><strong>4:</strong> Major news outlets (WSJ, NYT, Reuters, Bloomberg)</li>
                        <li><strong>3:</strong> Trade press and industry publications</li>
                        <li><strong>2:</strong> Think tanks, research organizations, advocacy groups</li>
                        <li><strong>1:</strong> Blogs, social media, unverified sources</li>
                      </ul>
                      <p className="text-xs mt-2"><strong>Requirement:</strong> Minimum 5 sources per company, preference for scores 3+</p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-1">3. Data Quality Flags</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li><strong>incomplete_data:</strong> Source count &lt; 5</li>
                        <li><strong>conflicting_sources:</strong> AI detects contradictory information</li>
                        <li><strong>outdated_information:</strong> No recent data (2024-2025)</li>
                        <li><strong>verification_needed:</strong> Array of specific claims requiring fact-check</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-1">4. Provenance Tracking</p>
                      <p className="text-xs mb-1">Every finding requires:</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>Source ID references (provenance_ids array)</li>
                        <li>Verbatim quotes where applicable</li>
                        <li>Date of information capture</li>
                        <li>Source reliability score</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Automation Pipeline */}
            <Card id="automation-pipeline" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
                  Automation Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">End-to-End Workflow</p>

                  <div className="bg-muted/50 rounded-lg p-4 mt-3 font-mono text-xs space-y-2 overflow-x-auto">
                    <p className="font-bold text-foreground">MEASURE INDEX PIPELINE</p>
                    <div className="space-y-1 pl-2">
                      <p>1. INPUT: sp500.csv</p>
                      <p className="pl-3">└── 503 companies (as of 2025)</p>

                      <p>2. BATCH REQUEST GENERATION</p>
                      <p className="pl-3">├── Tool: batch_api_launcher.py</p>
                      <p className="pl-3">└── Output: batch_api_requests.jsonl</p>

                      <p>3. BATCH SUBMISSION</p>
                      <p className="pl-3">├── Tool: submit_batch.py</p>
                      <p className="pl-3">├── API: Anthropic Batch API</p>
                      <p className="pl-3">└── Model: claude-sonnet-4-5-20250929</p>

                      <p>4. RESULTS DOWNLOAD</p>
                      <p className="pl-3">├── Tool: download_batch_results.py</p>
                      <p className="pl-3">└── Output: research_data/{'{TICKER}'}_research.json</p>

                      <p>5. PROFILE GENERATION</p>
                      <p className="pl-3">├── Tool: create_company_profile.py</p>
                      <p className="pl-3">└── Output: company_profiles/{'{TICKER}'}_profile.json</p>

                      <p>6. DATABASE IMPORT</p>
                      <p className="pl-3">├── Tool: database/import_profiles.py</p>
                      <p className="pl-3">├── Target: PostgreSQL (Supabase)</p>
                      <p className="pl-3">└── Schema: 15 tables, 3 views</p>

                      <p>7. QUERY & ANALYSIS</p>
                      <p className="pl-3">└── Applications: Dashboards, APIs, research tools</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitations & Considerations */}
            <Card id="limitations" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                  Limitations & Considerations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Methodological Limitations</p>
                  <div className="space-y-2">
                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-1">1. Point-in-Time Analysis</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>Research captures snapshot at time of capture</li>
                        <li>Corporate policies and leadership can change rapidly</li>
                        <li><strong>Recommendation:</strong> Periodic re-research (quarterly or annually)</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-1">2. Source Availability Bias</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>Larger companies have more public information</li>
                        <li>Smaller S&P 500 companies may have less DEI disclosure</li>
                        <li>Private companies or recent IPOs may lack historical data</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-1">3. AI Analysis Subjectivity</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>AI-generated insights reflect model interpretation</li>
                        <li>Ratings (commitment strength, transparency) are qualitative assessments</li>
                        <li><strong>Recommendation:</strong> Human review for high-stakes decisions</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-foreground text-xs mb-1">4. Risk Score Simplification</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>Algorithm weights may not capture nuance of specific cases</li>
                        <li>Ongoing lawsuit may be frivolous or meritorious (not differentiated)</li>
                        <li>Settled cases may involve admissions or no-fault settlements</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Ethical Considerations</p>
                  <div className="space-y-2">
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 mt-3 border border-blue-200 dark:border-blue-800">
                      <p className="font-semibold text-foreground text-xs mb-1">Fairness & Representation</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>Analysis focuses on publicly available information (transparency bias)</li>
                        <li>Companies with less disclosure not necessarily less committed</li>
                        <li>Risk scores reflect legal exposure, not inherent company values</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 mt-3 border border-blue-200 dark:border-blue-800">
                      <p className="font-semibold text-foreground text-xs mb-1">Use Case Appropriateness</p>
                      <ul className="space-y-1 text-xs list-disc list-inside">
                        <li>Intended for research, analysis, and advocacy</li>
                        <li>Not suitable as sole basis for investment decisions</li>
                        <li>Human judgment required for contextual interpretation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
              <p><strong>Document Prepared By:</strong> MEASURE Index Research Team</p>
              <p><strong>Last Updated:</strong> November 2, 2025</p>
              <p className="mt-3">Version 1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
