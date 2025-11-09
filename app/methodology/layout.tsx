import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research Methodology | DEI Tracking & Diversity Data Collection | MEASURE Labs',
  description: 'Comprehensive research methodology for tracking corporate DEI commitments. Learn about our diversity, equity, and inclusion data collection, analysis framework, verification processes, and quality assurance protocols.',
  keywords: 'DEI research methodology, corporate DEI tracking, data verification, research framework, ESG methodology, commitment analysis, diversity research',
}

export default function MethodologyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
