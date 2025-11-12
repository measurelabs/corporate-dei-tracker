import Link from 'next/link'
import { Company } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { getRecommendationColor, getDEIStatusColor, getRiskLevelColor, formatIndustry } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface CompanyListProps {
  companies: Company[]
}

export function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="border border-border rounded overflow-hidden divide-y divide-border">
      {companies.map((company) => (
        <Link
          key={company.id}
          href={`/companies/${company.id}`}
          className="group block"
        >
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            {/* Left: Company Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-150 truncate">
                  {company.name}
                </h3>
                {company.ticker && (
                  <span className="inline-block px-1.5 py-0.5 text-xs font-mono font-medium bg-muted text-muted-foreground rounded shrink-0">
                    {company.ticker}
                  </span>
                )}
              </div>

              {/* Industry */}
              <p className="text-xs text-muted-foreground truncate">
                {formatIndustry(company.industry)}
              </p>
            </div>

            {/* Right: Badges and Metrics */}
            <div className="flex items-center gap-2 shrink-0">
              {/* DEI Status */}
              {company.dei_status && (
                <Badge
                  variant={getDEIStatusColor(company.dei_status) as any}
                  className="text-xs hidden sm:inline-flex"
                >
                  {company.dei_status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
              )}

              {/* Risk Level */}
              {company.risk_level && (
                <Badge
                  variant={getRiskLevelColor(company.risk_level) as any}
                  className="text-xs hidden md:inline-flex"
                >
                  {company.risk_level?.charAt(0).toUpperCase() + company.risk_level?.slice(1).toLowerCase()}
                </Badge>
              )}

              {/* Recommendation */}
              {company.recommendation && (
                <Badge
                  variant={getRecommendationColor(company.recommendation) as any}
                  className="text-xs"
                >
                  {company.recommendation?.charAt(0).toUpperCase() + company.recommendation?.slice(1).toLowerCase()}
                </Badge>
              )}

              {/* Sources */}
              {company.source_count && company.source_count > 0 && (
                <span className="text-xs text-muted-foreground hidden lg:inline">
                  {company.source_count} {company.source_count === 1 ? 'source' : 'sources'}
                </span>
              )}

              {/* Arrow */}
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-150" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
