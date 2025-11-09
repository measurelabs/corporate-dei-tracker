import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'At-Risk Companies | DEI Rollback Tracking & Diversity Commitment Alerts | MEASURE Labs',
  description: 'Companies flagged as at-risk for diversity, equity, and inclusion commitment rollbacks. Track corporations showing warning signs of retreating from DEI initiatives and diversity programs.',
  keywords: 'DEI rollback, at-risk companies, corporate DEI retreat, diversity commitment risk, DEI backtracking, corporate accountability alerts, inclusion rollback',
}

export default function AtRiskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
