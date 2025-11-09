'use client'

import { useEffect, useState } from 'react'
import { api, FullProfile } from '@/lib/api'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Award } from 'lucide-react'

export default function TopCommittedPage() {
  const [profiles, setProfiles] = useState<FullProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTopCommitted()
  }, [])

  const loadTopCommitted = async () => {
    try {
      setLoading(true)
      // Use the new efficient endpoint that queries profiles_full view
      const profiles = await api.getTopCommittedProfiles(20)
      setProfiles(profiles)
    } catch (error) {
      console.error('Failed to load top committed companies:', error)
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
            <Award className="h-6 w-6 text-green-600 dark:text-green-500" />
            <h1 className="text-3xl font-bold text-foreground">Top Committed Companies</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Companies with the highest number of DEI commitments and initiatives
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
              const commitmentCount = profile.commitment_count || 0
              const commitmentStrengthRating = profile.ai_commitment_strength_rating
              const executiveSummary = profile.ai_executive_summary

              return (
                <Card key={profile.id} className="border-border hover:border-green-500/50 transition-colors mb-4">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Rank Badge */}
                        <div className="flex-shrink-0">
                          <div className={`
                            w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm
                            ${index < 3 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-muted text-muted-foreground'}
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

                            {/* Metrics */}
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                <Target className="h-4 w-4 text-green-600 dark:text-green-500" />
                                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                  {commitmentCount} Commitments
                                </span>
                              </div>
                              {commitmentStrengthRating && (
                                <div className="text-xs text-muted-foreground">
                                  Strength: {commitmentStrengthRating}/10
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Executive Summary */}
                          {executiveSummary && (
                            <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
                              <p className="text-sm text-foreground leading-relaxed">
                                {executiveSummary}
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
