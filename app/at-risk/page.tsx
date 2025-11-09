'use client'

import { useEffect, useState } from 'react'
import { api, FullProfile } from '@/lib/api'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldAlert, AlertTriangle } from 'lucide-react'
import { getRiskLevelColor } from '@/lib/utils'

export default function AtRiskPage() {
  const [profiles, setProfiles] = useState<FullProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAtRisk()
  }, [])

  const loadAtRisk = async () => {
    try {
      setLoading(true)
      // Use the new efficient endpoint that queries profiles_full view
      const profiles = await api.getAtRiskProfiles(20)
      setProfiles(profiles)
    } catch (error) {
      console.error('Failed to load at-risk companies:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-500" />
            <h1 className="text-3xl font-bold text-foreground">Most At-Risk Companies</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Companies with the highest DEI-related risk scores based on controversies and legal issues
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-32 bg-card border border-border rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile: any, index) => {
              // profiles_full view has flattened structure
              const companyId = profile.company_id
              const companyName = profile.company_name
              const ticker = profile.company_ticker || profile.ticker
              const industry = profile.company_industry || profile.industry
              const riskScore = profile.overall_risk_score
              const riskLevel = profile.risk_level
              const ongoingLawsuits = profile.ongoing_lawsuits || 0
              const settledCases = profile.settled_cases || 0
              const controversyCount = profile.controversies?.length || 0
              const executiveSummary = profile.ai_executive_summary
              const assessmentNotes = profile.assessment_notes

              return (
                <Card key={profile.id} className="border-border hover:border-red-500/50 transition-colors mb-4">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Rank Badge */}
                        <div className="flex-shrink-0">
                          <div className={`
                            w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm
                            ${index < 3 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-muted text-muted-foreground'}
                          `}>
                            #{index + 1}
                          </div>
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground mb-1">
                                {companyName}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                {ticker && (
                                  <span className="font-mono font-medium text-xs px-2 py-0.5 rounded-md bg-muted border border-border">
                                    {ticker}
                                  </span>
                                )}
                                {industry && (
                                  <>
                                    <span>•</span>
                                    <span>{industry}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Risk Metrics */}
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-500" />
                                <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                                  Risk: {riskScore}/100
                                </span>
                              </div>
                              {riskLevel && (
                                <Badge variant={getRiskLevelColor(riskLevel) as any} className="text-xs">
                                  {riskLevel}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Risk Details */}
                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            {ongoingLawsuits > 0 && (
                              <div className="flex items-center gap-1.5">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <span className="text-muted-foreground">
                                  {ongoingLawsuits} Ongoing Lawsuit{ongoingLawsuits !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                            {settledCases > 0 && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">
                                  {settledCases} Settled Case{settledCases !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                            {controversyCount > 0 && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">
                                  {controversyCount} Controvers{controversyCount !== 1 ? 'ies' : 'y'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Executive Summary or Assessment Notes */}
                          {(executiveSummary || assessmentNotes) && (
                            <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
                              <p className="text-sm text-foreground leading-relaxed">
                                {executiveSummary || assessmentNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* View Full Profile Link */}
                      <Link
                        href={`/companies/${companyId}`}
                        className="block mt-4 pt-4 border-t border-border text-center text-sm text-primary hover:underline"
                      >
                        View Full Company Profile →
                      </Link>
                    </CardContent>
                  </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
