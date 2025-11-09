'use client'

import { SupplierDiversity } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, DollarSign, FileText } from 'lucide-react'

interface SupplierDiversityCardProps {
  supplierDiversity?: SupplierDiversity | null
  showCompany?: boolean
}

export function SupplierDiversityCard({ supplierDiversity, showCompany = false }: SupplierDiversityCardProps) {
  if (!supplierDiversity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supplier Diversity Program</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No supplier diversity information available</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'established':
        return <Badge variant="default" className="bg-green-500">Active</Badge>
      case 'developing':
      case 'in_development':
        return <Badge variant="default">Developing</Badge>
      case 'planned':
        return <Badge variant="secondary">Planned</Badge>
      case 'discontinued':
      case 'inactive':
        return <Badge variant="destructive">Discontinued</Badge>
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">Supplier Diversity Program</CardTitle>
            {showCompany && supplierDiversity.company && (
              <p className="text-sm text-muted-foreground">
                {supplierDiversity.company.name} ({supplierDiversity.company.ticker})
              </p>
            )}
          </div>
          {supplierDiversity.program_exists ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Program Status</span>
            </div>
            <div className="pl-6">
              {supplierDiversity.program_exists ? (
                supplierDiversity.program_status ? (
                  getStatusBadge(supplierDiversity.program_status)
                ) : (
                  <Badge variant="default" className="bg-green-500">Exists</Badge>
                )
              ) : (
                <Badge variant="outline">No Program</Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Spending Disclosure</span>
            </div>
            <div className="pl-6">
              {supplierDiversity.spending_disclosed ? (
                <Badge variant="default" className="bg-blue-500">Disclosed</Badge>
              ) : (
                <Badge variant="secondary">Not Disclosed</Badge>
              )}
            </div>
          </div>
        </div>

        {supplierDiversity.quotes && supplierDiversity.quotes.length > 0 && (
          <div className="mt-4 border-l-2 border-muted pl-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">STATEMENT</p>
            <p className="text-sm italic text-muted-foreground">
              &quot;{typeof supplierDiversity.quotes[0] === 'string' ? supplierDiversity.quotes[0] : (supplierDiversity.quotes[0] as any)?.text || JSON.stringify(supplierDiversity.quotes[0])}&quot;
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Last updated: {new Date(supplierDiversity.updated_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
