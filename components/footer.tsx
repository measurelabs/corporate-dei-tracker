'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api, IndustryStats } from '@/lib/api'
import { Building2, TrendingUp, Award, ShieldAlert, Briefcase, ChevronRight } from 'lucide-react'
import { formatIndustry } from '@/lib/utils'

// Helper function to get slug from industry name
function getIndustrySlug(industry: string | null | undefined): string {
  // Handle null or undefined industry values
  if (!industry) {
    return 'unknown'
  }

  return industry.toLowerCase()
    .replace(/[\s&]+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}


export function Footer() {
  const [industries, setIndustries] = useState<IndustryStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadIndustries = async () => {
      try {
        const stats = await api.getIndustryStats()
        // Sort by company count and take top industries
        const sortedStats = stats
          .sort((a, b) => b.company_count - a.company_count)
          .slice(0, 10) // Show top 10 industries in footer
        setIndustries(sortedStats)
      } catch (error) {
        console.error('Failed to load industries for footer:', error)
      } finally {
        setLoading(false)
      }
    }
    loadIndustries()
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Measure Labs"
                className="h-6 w-auto"
              />
              <span className="font-bold text-sm">MEASURE Labs</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Corporate DEI intelligence platform tracking diversity, equity, and inclusion metrics across companies worldwide.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/about"
                className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                About
              </Link>
              <span className="text-gray-400 self-center">•</span>
              <Link
                href="/dev"
                className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Developers
              </Link>
              <span className="text-gray-400 self-center">•</span>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                API Docs
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/companies"
                  className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-1"
                >
                  <Building2 className="h-3 w-3" />
                  All Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/top-committed"
                  className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-1"
                >
                  <Award className="h-3 w-3" />
                  Top Committed
                </Link>
              </li>
              <li>
                <Link
                  href="/at-risk"
                  className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-1"
                >
                  <ShieldAlert className="h-3 w-3" />
                  At-Risk Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-1"
                >
                  <TrendingUp className="h-3 w-3" />
                  Analytics Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries - Dynamic */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Industries We Track
            </h3>
            {loading ? (
              <div className="grid grid-cols-2 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                  {industries
                    .filter((industry) => industry.industry) // Skip entries with null/undefined industry names
                    .map((industry) => (
                      <Link
                        key={industry.industry}
                        href={`/industries/${getIndustrySlug(industry.industry)}`}
                        className="group flex items-center justify-between text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                      >
                        <span className="truncate">
                          {formatIndustry(industry.industry)}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-600 ml-1">
                          ({industry.company_count})
                        </span>
                      </Link>
                    ))}
                </div>
                {industries.length > 0 && (
                  <Link
                    href="/industries"
                    className="inline-flex items-center gap-1 mt-3 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    View all industries
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {currentYear} MEASURE Labs. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
              >
                Terms of Service
              </Link>
              <a
                href="https://github.com/yourusername/measure-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}