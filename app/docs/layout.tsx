import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation | MEASURE Labs DEI Tracker',
  description: 'Complete API reference for the MEASURE Labs DEI Tracker. Access comprehensive corporate DEI data programmatically.',
}

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
