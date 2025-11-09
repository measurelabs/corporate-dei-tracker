import Link from 'next/link'
import { Building2, MapPin, Users, DollarSign, FileText } from 'lucide-react'
import { Company } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { getRecommendationColor, getDEIStatusColor, getRiskLevelColor, getRatingColor, formatIndustry } from '@/lib/utils'

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`} className="group">
      <div className="h-full p-5 bg-card border border-border rounded">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-150">
                {company.name}
              </h3>
              {company.recommendation && (
                <Badge
                  variant={getRecommendationColor(company.recommendation) as any}
                  className="text-xs font-semibold shrink-0"
                >
                  {company.recommendation.charAt(0).toUpperCase() + company.recommendation.slice(1).toLowerCase()}
                </Badge>
              )}
            </div>
            {company.ticker && (
              <span className="inline-block px-1.5 py-0.5 text-xs font-mono font-medium bg-muted text-muted-foreground rounded">
                {company.ticker}
              </span>
            )}
          </div>
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {/* DEI Status */}
          {company.dei_status && (
            <Badge
              variant={getDEIStatusColor(company.dei_status) as any}
              className="text-xs"
            >
              {company.dei_status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Badge>
          )}

          {/* Risk Level */}
          {company.risk_level && (
            <Badge
              variant={getRiskLevelColor(company.risk_level) as any}
              className="text-xs"
            >
              {company.risk_level.charAt(0).toUpperCase() + company.risk_level.slice(1).toLowerCase()} Risk
            </Badge>
          )}

          {/* Commitment Rating */}
          {company.commitment_strength_rating && (
            <Badge variant={getRatingColor(company.commitment_strength_rating) as any} className="text-xs">
              Commitment: {company.commitment_strength_rating}/10
            </Badge>
          )}

          {/* Transparency Rating */}
          {company.transparency_rating && (
            <Badge variant={getRatingColor(company.transparency_rating) as any} className="text-xs">
              Transparency: {company.transparency_rating}/10
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <span className="truncate block">{formatIndustry(company.industry)}</span>
          </div>
          {company.source_count && company.source_count > 0 && (
            <Badge variant="outline" className="text-xs shrink-0">
              {company.source_count} {company.source_count === 1 ? 'Source' : 'Sources'}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
