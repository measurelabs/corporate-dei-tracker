import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top Committed Companies | Leading DEI & Diversity Inclusion Champions | MEASURE Labs',
  description: 'Leading companies with the strongest diversity, equity, and inclusion commitments. Discover corporations demonstrating substantial and verified dedication to DEI initiatives and diversity programs.',
  keywords: 'top DEI companies, leading diversity initiatives, strongest DEI commitments, corporate diversity leaders, DEI best practices, diversity champions, inclusion leaders',
}

export default function TopCommittedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
