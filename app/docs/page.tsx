'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Code,
  Key,
  Database,
  Users,
  Building2,
  FileText,
  TrendingUp,
  Shield,
  AlertTriangle,
  Calendar,
  Package,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
  Terminal,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'introduction', label: 'Introduction', icon: BookOpen },
  { id: 'authentication', label: 'Authentication', icon: Key },
  { id: 'quick-start', label: 'Quick Start', icon: Zap },
  { id: 'pagination', label: 'Pagination', icon: FileText },
  { id: 'companies', label: 'Companies API', icon: Building2 },
  { id: 'profiles', label: 'DEI Profiles API', icon: Users },
  { id: 'commitments', label: 'Commitments API', icon: Shield },
  { id: 'controversies', label: 'Controversies API', icon: AlertTriangle },
  { id: 'events', label: 'Events API', icon: Calendar },
  { id: 'sources', label: 'Sources API', icon: FileText },
  { id: 'analytics', label: 'Analytics API', icon: TrendingUp },
]

interface CodeBlockProps {
  code: string
  language?: string
}

function CodeBlock({ code, language = 'bash' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-800">
        <code className="font-mono">{code}</code>
      </pre>
      <button
        onClick={copyCode}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}

interface EndpointProps {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  description: string
  children?: React.ReactNode
}

function Endpoint({ method, path, description, children }: EndpointProps) {
  const methodColors = {
    GET: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    PATCH: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-start gap-3 mb-3">
        <Badge className={cn('font-mono text-xs', methodColors[method])}>
          {method}
        </Badge>
        <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded font-mono">
          {path}
        </code>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      {children}
    </div>
  )
}

interface ParamTableProps {
  params: Array<{
    name: string
    type: string
    required?: boolean
    description: string
    default?: string
  }>
}

function ParamTable({ params }: ParamTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="text-left py-2 pr-4 font-semibold">Parameter</th>
            <th className="text-left py-2 pr-4 font-semibold">Type</th>
            <th className="text-left py-2 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={param.name} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-4">
                <code className="text-violet-600 dark:text-violet-400">{param.name}</code>
                {param.required && (
                  <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                )}
              </td>
              <td className="py-2 pr-4 text-muted-foreground">{param.type}</td>
              <td className="py-2 text-muted-foreground">
                {param.description}
                {param.default && <span className="block text-xs mt-1">Default: {param.default}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState('introduction')
  // Hardcode the full API URL for documentation purposes
  const baseUrl = 'https://api.measurelabs.org'
  const apiUrl = `${baseUrl}/v1`

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Table of Contents - Desktop Only */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                API Reference
              </p>
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    'flex items-center gap-2 w-full text-left text-sm py-2 px-3 rounded-md transition-colors',
                    activeSection === id
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-300 font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    API Documentation
                  </h1>
                  <Badge variant="outline" className="mt-2">
                    Version 1.0
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Complete reference for the MEASURE Labs DEI Tracker API. Access comprehensive corporate DEI data programmatically.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href={`${baseUrl}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-800 hover:opacity-90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Swagger UI
                </a>
                <a
                  href={`${baseUrl}/redoc`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:opacity-90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  ReDoc
                </a>
                <a
                  href={`${baseUrl}/openapi.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  <Code className="h-4 w-4" />
                  OpenAPI Spec
                </a>
              </div>
            </div>

            {/* Request API Key */}
            <Card className="mb-6 border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/50 dark:to-blue-950/50">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-600 dark:bg-violet-700 rounded-lg">
                    <Key className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">Request API Access</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The MEASURE Labs API is currently available to researchers, developers, journalists, and advocacy organizations.
                      Public access coming soon.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Free for researchers and non-profit organizations</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Developer-friendly with comprehensive documentation</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Access to 1000+ companies and 50K+ verified sources</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <a
                        href="mailto:api@measurelabs.org?subject=API%20Access%20Request"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 dark:bg-violet-700 hover:opacity-90 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        <Key className="h-4 w-4" />
                        Request API Key
                      </a>
                      <p className="text-xs text-muted-foreground mt-3">
                        Include your name, organization, and intended use case in your request.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Introduction */}
            <Card id="introduction" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-500" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The MEASURE Labs API provides programmatic access to our comprehensive database of corporate DEI commitments,
                  profiles, controversies, and analytics. All responses are in JSON format.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Base URL</h4>
                  <CodeBlock code={apiUrl} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Database className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Rich Data</p>
                      <p className="text-xs text-muted-foreground">1000+ companies, 50K+ sources</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Fast & Cached</p>
                      <p className="text-xs text-muted-foreground">Redis caching for speed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Secure</p>
                      <p className="text-xs text-muted-foreground">API key authentication</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Well Documented</p>
                      <p className="text-xs text-muted-foreground">Comprehensive docs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authentication */}
            <Card id="authentication" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All API requests require an API key passed in the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">X-API-Key</code> header.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Example Request</h4>
                  <CodeBlock
                    code={`curl ${apiUrl}/companies \\
  -H "X-API-Key: your_api_key_here"`}
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">Security Best Practices</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Never expose API keys in client-side code</li>
                        <li>• Store keys in environment variables</li>
                        <li>• Rotate keys periodically</li>
                        <li>• Use different keys for dev and production</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">HTTP Status Codes</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">200</Badge>
                      <span className="text-muted-foreground">OK - Request succeeded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">401</Badge>
                      <span className="text-muted-foreground">Unauthorized - Invalid or missing API key</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">403</Badge>
                      <span className="text-muted-foreground">Forbidden - Insufficient permissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">404</Badge>
                      <span className="text-muted-foreground">Not Found - Resource doesn't exist</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card id="quick-start" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get started quickly with these common examples.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">1. Get All Companies</h4>
                    <CodeBlock
                      code={`curl "${apiUrl}/companies?page=1&per_page=20" \\
  -H "X-API-Key: your_api_key_here"`}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">2. Search by Ticker Symbol</h4>
                    <CodeBlock
                      code={`curl "${apiUrl}/companies/ticker/AAPL" \\
  -H "X-API-Key: your_api_key_here"`}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">3. Get Full DEI Profile</h4>
                    <CodeBlock
                      code={`curl "${apiUrl}/profiles/123/full" \\
  -H "X-API-Key: your_api_key_here"`}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Python Example</h4>
                    <CodeBlock
                      language="python"
                      code={`import requests

API_KEY = "your_api_key_here"
BASE_URL = "${apiUrl}"
headers = {"X-API-Key": API_KEY}

# Get companies
response = requests.get(f"{BASE_URL}/companies", headers=headers)
companies = response.json()

# Get company's latest profile
company_id = companies["data"][0]["id"]
profile = requests.get(
    f"{BASE_URL}/profiles/company/{company_id}/latest",
    headers=headers
).json()`}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">JavaScript Example</h4>
                    <CodeBlock
                      language="javascript"
                      code={`const API_KEY = 'your_api_key_here';
const BASE_URL = '${apiUrl}';

const headers = { 'X-API-Key': API_KEY };

// Get companies
const response = await fetch(\`\${BASE_URL}/companies\`, { headers });
const companies = await response.json();

// Get company's latest profile
const companyId = companies.data[0].id;
const profile = await fetch(
  \`\${BASE_URL}/profiles/company/\${companyId}/latest\`,
  { headers }
).then(r => r.json());`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            <Card id="pagination" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  Pagination & Filtering
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All list endpoints support pagination and filtering.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Pagination Parameters</h4>
                  <ParamTable
                    params={[
                      { name: 'page', type: 'integer', description: 'Page number', default: '1' },
                      { name: 'per_page', type: 'integer', description: 'Items per page (max: 100)', default: '20' },
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Response Format</h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 50,
    "total_count": 1000,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  }
}`}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Common Filters</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <code className="bg-muted px-1.5 py-0.5 rounded text-xs">search</code> - Text search (case-insensitive)</li>
                    <li>• <code className="bg-muted px-1.5 py-0.5 rounded text-xs">sort</code> & <code className="bg-muted px-1.5 py-0.5 rounded text-xs">order</code> - Sort results (asc/desc)</li>
                    <li>• <code className="bg-muted px-1.5 py-0.5 rounded text-xs">min_sources</code> - Minimum source count</li>
                    <li>• <code className="bg-muted px-1.5 py-0.5 rounded text-xs">status</code> - Filter by status (varies by endpoint)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Companies API */}
            <Card id="companies" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-violet-600 dark:text-violet-500" />
                  Companies API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Access corporate entities and their DEI profile summaries.
                </p>

                <Endpoint
                  method="GET"
                  path="/v1/companies"
                  description="List all companies with optional filtering by industry, location, and search"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'industry', type: 'string', description: 'Filter by industry' },
                        { name: 'country', type: 'string', description: 'Filter by country' },
                        { name: 'state', type: 'string', description: 'Filter by state (US companies)' },
                        { name: 'search', type: 'string', description: 'Search company name' },
                        { name: 'sort', type: 'string', description: 'Field to sort by' },
                        { name: 'order', type: 'string', description: 'asc or desc', default: 'desc' },
                      ]}
                    />
                    <h5 className="font-semibold text-sm mt-4">Example</h5>
                    <CodeBlock
                      code={`curl "${apiUrl}/companies?industry=Technology&per_page=20" \\
  -H "X-API-Key: your_api_key_here"`}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/companies/{company_id}"
                  description="Get detailed company information with optional related data"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'include', type: 'string', description: 'Include: profile, commitments, sources, or all' },
                      ]}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/companies/ticker/{ticker}"
                  description="Look up company by stock ticker symbol (e.g., AAPL, MSFT)"
                />

                <Endpoint
                  method="GET"
                  path="/v1/companies/search/autocomplete"
                  description="Fast autocomplete search for building dropdowns (min 1 character)"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'q', type: 'string', required: true, description: 'Search query (min 1 char)' },
                        { name: 'limit', type: 'integer', description: 'Max results (1-50)', default: '10' },
                      ]}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/companies/search/advanced"
                  description="Multi-criteria search with arrays of industries, countries, and advanced filters"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'q', type: 'string', description: 'Text search query' },
                        { name: 'industries[]', type: 'array', description: 'Multiple industries' },
                        { name: 'countries[]', type: 'array', description: 'Multiple countries' },
                        { name: 'has_commitments', type: 'boolean', description: 'Only companies with commitments' },
                        { name: 'min_sources', type: 'integer', description: 'Minimum source count' },
                      ]}
                    />
                  </div>
                </Endpoint>
              </CardContent>
            </Card>

            {/* Profiles API */}
            <Card id="profiles" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  DEI Profiles API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Comprehensive DEI research profiles with AI analysis, risk scores, and source documentation.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-500 shrink-0" />
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">Profile Sizes</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• <strong>Lightweight</strong> (full=false): Basic metadata only</li>
                        <li>• <strong>Standard</strong> (full=true): All components + related data</li>
                        <li>• <strong>Complete</strong> (/full endpoint): Everything + relationships</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Endpoint
                  method="GET"
                  path="/v1/profiles"
                  description="List DEI profiles with filtering by company, sources, and recency"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'company_id', type: 'integer', description: 'Filter by company' },
                        { name: 'min_sources', type: 'integer', description: 'Minimum source count' },
                        { name: 'is_latest', type: 'boolean', description: 'Only latest per company' },
                      ]}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/profiles/{profile_id}/full"
                  description="Get complete profile with ALL components: AI analysis, posture, CDO, reporting, supplier diversity, risk, commitments, controversies, events, and sources"
                >
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />
                      <span>Large response: 50KB+ per profile with all related data</span>
                    </div>
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/profiles/company/{company_id}/latest"
                  description="Get the most recent profile for a specific company"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'full', type: 'boolean', description: 'Include full data', default: 'true' },
                      ]}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/profiles/ranked/at-risk"
                  description="Companies ranked by risk score (highest first) - identify DEI-related risks"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'limit', type: 'integer', description: 'Number of results (1-100)', default: '20' },
                      ]}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/profiles/ranked/top-committed"
                  description="Companies ranked by commitment count (most committed first)"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'limit', type: 'integer', description: 'Number of results (1-100)', default: '20' },
                      ]}
                    />
                  </div>
                </Endpoint>
              </CardContent>
            </Card>

            {/* Commitments API */}
            <Card id="commitments" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-500" />
                  Commitments API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Track DEI pledges and initiatives, monitor status changes over time.
                </p>

                <Endpoint
                  method="GET"
                  path="/v1/commitments"
                  description="List all commitments with filtering by type, status, company, and text search"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'profile_id', type: 'integer', description: 'Filter by profile' },
                        { name: 'company_id', type: 'integer', description: 'Filter by company' },
                        { name: 'commitment_type', type: 'string', description: 'pledge or industry_initiative' },
                        { name: 'status', type: 'string', description: 'active, completed, discontinued' },
                        { name: 'search', type: 'string', description: 'Search commitment name' },
                      ]}
                    />
                    <h5 className="font-semibold text-sm mt-4">Example</h5>
                    <CodeBlock
                      code={`curl "${apiUrl}/commitments?status=active&commitment_type=pledge" \\
  -H "X-API-Key: your_api_key_here"`}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/commitments/{commitment_id}"
                  description="Get detailed commitment information with source citations"
                />

                <Endpoint
                  method="GET"
                  path="/v1/commitments/types/stats"
                  description="Statistics on commitment types and status distribution"
                />
              </CardContent>
            </Card>

            {/* Controversies API */}
            <Card id="controversies" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                  Controversies API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Track DEI-related lawsuits, discrimination cases, and legal challenges.
                </p>

                <Endpoint
                  method="GET"
                  path="/v1/controversies"
                  description="List controversies with filtering by type, status, and company"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'profile_id', type: 'integer', description: 'Filter by profile' },
                        { name: 'company_id', type: 'integer', description: 'Filter by company' },
                        { name: 'type', type: 'string', description: 'discrimination, pay_equity, harassment' },
                        { name: 'status', type: 'string', description: 'ongoing, settled, dismissed' },
                        { name: 'search', type: 'string', description: 'Search description' },
                      ]}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/controversies/{controversy_id}"
                  description="Get detailed controversy with legal details and source documentation"
                />
              </CardContent>
            </Card>

            {/* Events API */}
            <Card id="events" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                  Events API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Track significant DEI events, announcements, milestones, and setbacks.
                </p>

                <Endpoint
                  method="GET"
                  path="/v1/events"
                  description="List events with comprehensive filtering by sentiment, impact, and category"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'company_id', type: 'integer', description: 'Filter by company' },
                        { name: 'event_type', type: 'string', description: 'Type of event' },
                        { name: 'sentiment', type: 'string', description: 'positive, negative, neutral' },
                        { name: 'impact', type: 'string', description: 'high, major, medium, low' },
                        { name: 'event_category', type: 'string', description: 'announcements, milestones, setbacks, changes' },
                      ]}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/events/{event_id}"
                  description="Get event details with sources and impact assessment"
                />

                <Endpoint
                  method="GET"
                  path="/v1/events/types/stats"
                  description="Statistics on event types, sentiment, and impact distribution"
                />
              </CardContent>
            </Card>

            {/* Sources API */}
            <Card id="sources" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  Sources API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Access documentation sources with reliability scores (1-5 scale).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-600">5</Badge>
                    <span className="text-muted-foreground">SEC filings, official reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">4</Badge>
                    <span className="text-muted-foreground">Major news, press releases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-blue-500">3</Badge>
                    <span className="text-muted-foreground">Industry publications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-yellow-500">2</Badge>
                    <span className="text-muted-foreground">Social media, blogs</span>
                  </div>
                </div>

                <Endpoint
                  method="GET"
                  path="/v1/sources"
                  description="List sources with filtering by type, reliability, publisher, and company"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'company_id', type: 'integer', description: 'Filter by company' },
                        { name: 'source_type', type: 'string', description: 'news, report, filing, academic, blog' },
                        { name: 'min_reliability', type: 'integer', description: 'Minimum reliability (1-5)' },
                        { name: 'publisher', type: 'string', description: 'Filter by publisher' },
                        { name: 'search', type: 'string', description: 'Search title and notes' },
                      ]}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/sources/{source_id}"
                  description="Get source details including URL, title, reliability, and notes"
                />

                <Endpoint
                  method="GET"
                  path="/v1/sources/types/stats"
                  description="Statistics on source types and reliability distribution"
                />
              </CardContent>
            </Card>

            {/* Analytics API */}
            <Card id="analytics" className="mb-6 border-border bg-card/50 backdrop-blur-sm scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                  Analytics API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Aggregated metrics, industry comparisons, and risk analysis.
                </p>

                <Endpoint
                  method="GET"
                  path="/v1/analytics/overview"
                  description="Platform-wide statistics: totals, averages, breakdowns by type, risk levels, and recommendations"
                />

                <Endpoint
                  method="GET"
                  path="/v1/analytics/industries"
                  description="DEI metrics aggregated by industry sector for comparative analysis"
                />

                <Endpoint
                  method="GET"
                  path="/v1/analytics/compare"
                  description="Side-by-side comparison of 2-5 companies with comprehensive metrics"
                >
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Query Parameters</h5>
                    <ParamTable
                      params={[
                        { name: 'company_ids[]', type: 'array', required: true, description: '2-5 company IDs to compare' },
                      ]}
                    />
                    <h5 className="font-semibold text-sm mt-4">Example</h5>
                    <CodeBlock
                      code={`curl "${apiUrl}/analytics/compare?company_ids[]=1&company_ids[]=2&company_ids[]=3" \\
  -H "X-API-Key: your_api_key_here"`}
                    />
                  </div>
                </Endpoint>

                <Endpoint
                  method="GET"
                  path="/v1/analytics/risks"
                  description="Risk distribution statistics and trends across all companies"
                />
              </CardContent>
            </Card>

            {/* Footer CTA */}
            <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/50 dark:to-blue-950/50">
              <CardContent className="py-8 text-center space-y-4">
                <h3 className="text-xl font-bold">Ready to Get Started?</h3>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                  Access comprehensive corporate DEI data through our API. Build dashboards, monitor risks, and track commitments programmatically.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <Link href="/companies">
                    <Button>
                      <Building2 className="mr-2 h-4 w-4" />
                      Browse Companies
                    </Button>
                  </Link>
                  <a
                    href={`${baseUrl}/docs`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Interactive Docs
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
