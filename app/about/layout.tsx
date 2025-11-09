import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Corporate DEI Tracking & Diversity Inclusion Intelligence | MEASURE Labs',
  description: 'Learn how MEASURE Labs tracks corporate DEI commitments across 360+ companies, synthesizing thousands of data sources into verified diversity, equity, and inclusion intelligence for investors, advocates, and researchers.',
  keywords: 'corporate DEI, diversity equity inclusion, corporate accountability, DEI commitments, ESG data, corporate transparency, diversity tracking',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
