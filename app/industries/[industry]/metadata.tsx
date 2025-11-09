import { Metadata } from 'next'

// Industry metadata configuration
const industryMetadata: Record<string, {
  title: string
  description: string
  keywords: string[]
}> = {
  'technology': {
    title: 'Technology Industry DEI Analytics | Corporate DEI Tracker',
    description: 'Comprehensive diversity, equity, and inclusion metrics for technology companies. Track DEI commitments, leadership diversity, and corporate social responsibility in the tech sector.',
    keywords: ['tech diversity', 'technology DEI', 'silicon valley diversity', 'tech inclusion', 'software companies DEI', 'FAANG diversity', 'startup diversity']
  },
  'financial-services': {
    title: 'Financial Services DEI Analytics | Banking & Insurance Diversity',
    description: 'Track diversity metrics and inclusion initiatives across banks, insurance companies, and financial institutions. Monitor DEI progress in the finance industry.',
    keywords: ['finance diversity', 'banking DEI', 'financial services inclusion', 'wall street diversity', 'insurance DEI', 'investment banking diversity']
  },
  'healthcare': {
    title: 'Healthcare Industry DEI Analytics | Medical & Pharma Diversity',
    description: 'Monitor diversity, equity, and inclusion progress in healthcare organizations, pharmaceutical companies, and medical device manufacturers.',
    keywords: ['healthcare diversity', 'medical DEI', 'pharmaceutical inclusion', 'hospital diversity', 'health equity', 'biotech diversity']
  },
  'retail': {
    title: 'Retail Industry DEI Analytics | E-commerce & Consumer Diversity',
    description: 'Explore diversity metrics and inclusion initiatives in retail companies, from e-commerce giants to traditional retailers.',
    keywords: ['retail diversity', 'e-commerce DEI', 'retail inclusion', 'consumer goods diversity', 'shopping DEI', 'Amazon diversity']
  },
  'manufacturing': {
    title: 'Manufacturing Industry DEI Analytics | Industrial Diversity Metrics',
    description: 'Track diversity, equity, and inclusion progress in manufacturing companies, industrial firms, and production facilities worldwide.',
    keywords: ['manufacturing diversity', 'industrial DEI', 'factory inclusion', 'production diversity', 'supply chain DEI', 'automotive diversity']
  },
  'energy': {
    title: 'Energy Industry DEI Analytics | Oil, Gas & Renewables Diversity',
    description: 'Monitor DEI initiatives in energy companies including oil, gas, renewables, and utilities. Track diversity progress in the energy sector.',
    keywords: ['energy diversity', 'oil gas DEI', 'renewable energy inclusion', 'utilities diversity', 'green energy DEI']
  },
  'telecommunications': {
    title: 'Telecommunications DEI Analytics | Telecom & Media Diversity',
    description: 'Track diversity metrics in telecommunications, media, and communications technology companies worldwide.',
    keywords: ['telecom diversity', 'telecommunications DEI', 'media inclusion', 'communications diversity', 'AT&T Verizon diversity']
  },
  'consumer-goods': {
    title: 'Consumer Goods DEI Analytics | CPG & FMCG Diversity Metrics',
    description: 'Analyze diversity, equity, and inclusion in consumer packaged goods and fast-moving consumer goods companies.',
    keywords: ['CPG diversity', 'FMCG DEI', 'consumer goods inclusion', 'Procter Gamble diversity', 'Unilever DEI']
  },
  'automotive': {
    title: 'Automotive Industry DEI Analytics | Auto Manufacturing Diversity',
    description: 'Track DEI progress in automotive manufacturers, suppliers, and mobility companies globally.',
    keywords: ['automotive diversity', 'auto industry DEI', 'car manufacturer inclusion', 'Tesla diversity', 'Ford GM DEI']
  },
  'media-entertainment': {
    title: 'Media & Entertainment DEI Analytics | Hollywood & Gaming Diversity',
    description: 'Monitor diversity initiatives in media, entertainment, gaming, and content creation companies.',
    keywords: ['media diversity', 'entertainment DEI', 'Hollywood inclusion', 'gaming diversity', 'Netflix Disney DEI']
  }
}

export function generateMetadata({ params }: { params: { industry: string } }): Metadata {
  const industry = params.industry.toLowerCase()
  const meta = industryMetadata[industry] || {
    title: `${industry.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Industry DEI Analytics`,
    description: `Track diversity, equity, and inclusion metrics for companies in the ${industry} industry.`,
    keywords: [`${industry} diversity`, `${industry} DEI`, `${industry} inclusion`]
  }

  const canonicalUrl = `https://yoursite.com/industries/${industry}`

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords.join(', '),
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Corporate DEI Tracker',
      images: [
        {
          url: '/og-industry.png',
          width: 1200,
          height: 630,
          alt: meta.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/twitter-industry.png']
    },
    alternates: {
      canonical: canonicalUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}