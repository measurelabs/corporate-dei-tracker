import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Companies | Corporate DEI Directory & Diversity Inclusion Commitments | MEASURE Labs',
  description: 'Browse and search 360+ companies tracked by MEASURE Labs. Filter by industry, commitment status, and risk level to discover corporate diversity, equity, and inclusion commitments and accountability records.',
  keywords: 'corporate directory, company DEI commitments, corporate accountability, DEI company search, diversity initiatives by company, inclusion programs',
}

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
