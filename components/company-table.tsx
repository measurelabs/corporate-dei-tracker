import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Company } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { getRecommendationColor, getDEIStatusColor, getRiskLevelColor, formatIndustry } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface CompanyTableProps {
  companies: Company[]
  hasMore: boolean
  onLoadMore: () => void
  isLoading: boolean
}

export function CompanyTable({ companies, hasMore, onLoadMore, isLoading }: CompanyTableProps) {
  const observerTarget = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, isLoading, onLoadMore])

  return (
    <div className="border border-border rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border sticky top-0 z-10">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                Company
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                Ticker
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                Industry
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                DEI Status
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                Risk Level
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                Recommendation
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                Sources
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {companies.map((company) => (
              <tr
                key={company.id}
                className="group"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/companies/${company.id}`}
                    className="font-medium text-sm text-foreground hover:text-primary transition-colors duration-150"
                  >
                    {company.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {company.ticker && (
                    <span className="inline-block px-1.5 py-0.5 text-xs font-mono font-medium bg-muted text-muted-foreground rounded">
                      {company.ticker}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                    {formatIndustry(company.industry)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {company.dei_status ? (
                    <Badge
                      variant={getDEIStatusColor(company.dei_status) as any}
                      className="text-xs"
                    >
                      {company.dei_status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {company.risk_level ? (
                    <Badge
                      variant={getRiskLevelColor(company.risk_level) as any}
                      className="text-xs"
                    >
                      {company.risk_level?.charAt(0).toUpperCase() + company.risk_level?.slice(1).toLowerCase()}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {company.recommendation ? (
                    <Badge
                      variant={getRecommendationColor(company.recommendation) as any}
                      className="text-xs"
                    >
                      {company.recommendation?.charAt(0).toUpperCase() + company.recommendation?.slice(1).toLowerCase()}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {company.source_count && company.source_count > 0 ? (
                    <span className="text-xs text-muted-foreground font-medium">
                      {company.source_count}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}

            {/* Infinite scroll trigger row */}
            {hasMore && (
              <tr ref={observerTarget}>
                <td colSpan={7} className="px-4 py-6 text-center">
                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Loading more companies...</span>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
