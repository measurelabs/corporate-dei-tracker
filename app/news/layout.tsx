import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Insights | Corporate DEI Tracker - MEASURE Labs',
  description: 'Latest news, analysis, and insights on corporate diversity, equity, and inclusion commitments. Track DEI policy changes, layoffs, restructuring, leadership updates, and industry trends across 360+ companies.',
  keywords: 'DEI news, corporate diversity news, inclusion updates, DEI policy changes, diversity commitment tracking, DEI layoffs, corporate restructuring, DEI analysis, diversity trends',
  openGraph: {
    title: 'News & Insights | Corporate DEI Tracker',
    description: 'Latest news, analysis, and insights on corporate diversity, equity, and inclusion commitments. Track DEI policy changes, layoffs, restructuring, and industry trends.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Insights | Corporate DEI Tracker',
    description: 'Latest news, analysis, and insights on corporate diversity, equity, and inclusion commitments.',
  },
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
