import { Metadata } from 'next'
import { api } from '@/lib/api'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  try {
    // Await params in Next.js 15+
    const { id } = await params

    // Fetch the company profile to get the name
    const profile = await api.getLatestProfileForCompany(id)
    const companyName = profile.company?.name || 'Company'

    return {
      title: `${companyName} | DEI Profile & Diversity Equity Inclusion Commitments | MEASURE Labs`,
      description: `View ${companyName}'s complete diversity, equity, and inclusion profile, including verified DEI commitments, controversies, risk level, and accountability history tracked by MEASURE Labs.`,
      keywords: `${companyName} DEI, ${companyName} diversity, ${companyName} inclusion, ${companyName} commitments, corporate DEI profile, ${companyName} accountability, ${companyName} diversity programs`,
    }
  } catch (error) {
    // Fallback metadata if the API call fails
    return {
      title: 'Company Profile | Corporate DEI & Diversity Inclusion Tracking | MEASURE Labs',
      description: 'View detailed diversity, equity, and inclusion commitment profile, including verified DEI commitments, controversies, and accountability history.',
      keywords: 'company DEI profile, corporate diversity, DEI commitments, corporate accountability, inclusion programs',
    }
  }
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
