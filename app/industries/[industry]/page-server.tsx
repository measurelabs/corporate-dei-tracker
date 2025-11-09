import { Metadata } from 'next'
import IndustryPageClient from './page'
import { generateMetadata as generateIndustryMetadata } from './metadata'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { industry: string } }): Promise<Metadata> {
  return generateIndustryMetadata({ params })
}

// Server component wrapper for the client component
export default function IndustryPage({ params }: { params: { industry: string } }) {
  const industry = params.industry

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${industry.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Industry DEI Analytics`,
    description: `Comprehensive diversity, equity, and inclusion metrics for companies in the ${industry} industry.`,
    url: `https://yoursite.com/industries/${industry}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://yoursite.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Companies',
          item: 'https://yoursite.com/companies'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: industry.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          item: `https://yoursite.com/industries/${industry}`
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      name: `Companies in ${industry.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      description: `List of companies in the ${industry} industry with DEI metrics and analytics`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <IndustryPageClient />
    </>
  )
}