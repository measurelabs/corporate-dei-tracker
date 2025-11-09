import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics | Corporate DEI Trends & Diversity Equity Inclusion Metrics | MEASURE Labs',
  description: 'Comprehensive analytics on corporate DEI commitments across 360+ companies. Explore diversity, equity, and inclusion trends, industry breakdowns, commitment categories, and data-driven insights on corporate DEI initiatives.',
  keywords: 'DEI analytics, corporate diversity data, DEI trends, industry analysis, commitment analytics, DEI metrics, ESG analytics dashboard, inclusion metrics',
}

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
