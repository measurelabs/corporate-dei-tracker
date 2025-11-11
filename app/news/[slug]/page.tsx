'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { client, SanityArticle, articleBySlugQuery, urlFor } from '@/lib/sanity'
import { format } from 'date-fns'
import { Calendar, User, ArrowLeft, Share2, Building2, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { cn } from '@/lib/utils'

const categories = [
  { value: 'dei-policy', label: 'DEI Policy' },
  { value: 'layoffs', label: 'Layoffs' },
  { value: 'restructuring', label: 'Restructuring' },
  { value: 'commitment-changes', label: 'Commitment Changes' },
  { value: 'legal', label: 'Legal' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'industry-trends', label: 'Industry Trends' },
]

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'dei-policy': 'blue',
    'layoffs': 'red',
    'restructuring': 'orange',
    'commitment-changes': 'yellow',
    'legal': 'purple',
    'leadership': 'green',
    'analysis': 'gray',
    'industry-trends': 'blue',
  }
  return colors[category] || 'gray'
}

interface Heading {
  id: string
  text: string
  level: number
}

export default function ArticlePage() {
  const params = useParams()
  const slug = params?.slug as string
  const [article, setArticle] = useState<SanityArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeSection, setActiveSection] = useState<string>('')

  // Extract headings from article body
  const extractHeadings = (body: any[]): Heading[] => {
    const headingsList: Heading[] = []
    body?.forEach((block) => {
      if (block._type === 'block' && ['h2', 'h3', 'h4'].includes(block.style)) {
        const text = block.children?.map((child: any) => child.text).join('') || ''
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        headingsList.push({
          id,
          text,
          level: parseInt(block.style.substring(1))
        })
      }
    })
    return headingsList
  }

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return

      try {
        setLoading(true)
        const data = await client.fetch<SanityArticle>(articleBySlugQuery(slug))
        setArticle(data)
        if (data?.body) {
          const extractedHeadings = extractHeadings(data.body)
          setHeadings(extractedHeadings)
        }
      } catch (error) {
        console.error('Failed to load article:', error)
      } finally {
        setLoading(false)
      }
    }
    loadArticle()
  }, [slug])

  // Scroll-based active section tracking
  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150 // Offset for better UX

      // Find the heading that's currently in view
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        const element = document.getElementById(heading.id)

        if (element) {
          const { top } = element.getBoundingClientRect()
          const elementPosition = window.scrollY + top

          if (scrollPosition >= elementPosition) {
            setActiveSection(heading.id)
            return
          }
        }
      }

      // If we're at the very top, activate the first heading
      if (scrollPosition < 200 && headings.length > 0) {
        setActiveSection(headings[0].id)
      }
    }

    // Initial call
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [headings])

  // Auto-scroll TOC to keep active section visible
  useEffect(() => {
    if (!activeSection) return

    const tocButton = document.querySelector(`button[data-toc-id="${activeSection}"]`)
    if (tocButton) {
      tocButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [activeSection])

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

  const portableTextComponents = {
    block: {
      h1: () => null, // Skip H1 headings as title is already displayed in header
      h2: ({ children, value }: any) => {
        const text = value?.children?.map((child: any) => child.text).join('') || ''
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        return (
          <h2 id={id} className="text-2xl font-bold mt-8 mb-4 scroll-mt-20">{children}</h2>
        )
      },
      h3: ({ children, value }: any) => {
        const text = value?.children?.map((child: any) => child.text).join('') || ''
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        return (
          <h3 id={id} className="text-xl font-bold mt-6 mb-3 scroll-mt-20">{children}</h3>
        )
      },
      h4: ({ children, value }: any) => {
        const text = value?.children?.map((child: any) => child.text).join('') || ''
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        return (
          <h4 id={id} className="text-lg font-semibold mt-4 mb-2 scroll-mt-20">{children}</h4>
        )
      },
      normal: ({ children }: any) => <p className="mb-4 leading-7 text-sm text-muted-foreground">{children}</p>,
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-violet-600 dark:border-violet-400 pl-4 italic my-6 text-muted-foreground bg-muted/50 py-3 rounded-r">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-sm text-muted-foreground">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-sm text-muted-foreground">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="leading-7 pl-1">{children}</li>
      ),
      number: ({ children }: any) => (
        <li className="leading-7 pl-1">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
      em: ({ children }: any) => <em className="italic">{children}</em>,
      code: ({ children }: any) => (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
      ),
      link: ({ children, value }: any) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
        >
          {children}
        </a>
      ),
    },
    types: {
      image: ({ value }: any) => (
        <div className="my-8 relative w-full">
          <div className="relative h-96 w-full rounded-lg overflow-hidden border border-border">
            <Image
              src={urlFor(value).width(1200).height(800).url()}
              alt={value.alt || 'Article image'}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <p className="text-sm text-muted-foreground text-center mt-2 italic">{value.caption}</p>
          )}
        </div>
      ),
    },
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-20 space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
            <div className="flex-1 max-w-4xl animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-96 bg-muted rounded" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Article not found</h2>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/news">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to News
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10">
          <div className="max-w-7xl">
            {/* Back Button */}
            <Link href="/news">
              <Button variant="ghost" className="mb-4 group -ml-3">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to News
              </Button>
            </Link>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Column - Text Content */}
              <div>
                {/* Category & Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant={getCategoryColor(article.category) as any}>
                    {categories.find((c) => c.value === article.category)?.label || article.category}
                  </Badge>
                  {article.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {article.featured && (
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                  {article.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4 sm:mb-6">
                  {article.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={article.publishedAt}>
                      {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
                    </time>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2 -ml-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Right Column - Hero Image */}
              {article.mainImage && (
                <div className="relative h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden border border-border shadow-lg">
                  <Image
                    src={urlFor(article.mainImage).width(1400).height(800).url()}
                    alt={article.mainImage.alt || article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <div className="flex gap-8 justify-center">
          {/* Table of Contents - Desktop Only */}
          {headings.length > 0 && (
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    On This Page
                  </p>
                </div>
                <div className="overflow-y-auto space-y-1 pr-2 hide-scrollbar">
                  {headings.map(({ id, text, level }) => (
                    <button
                      key={id}
                      data-toc-id={id}
                      onClick={() => scrollToSection(id)}
                      className={cn(
                        'block w-full text-left py-1.5 px-2 rounded transition-colors',
                        level === 2 && 'pl-2 text-sm',
                        level === 3 && 'pl-4 text-sm',
                        level === 4 && 'pl-6 text-xs',
                        activeSection === id
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-300 font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 max-w-2xl pb-12">
            <article className="animate-fade-in space-y-4">
              <PortableText value={article.body} components={portableTextComponents} />
            </article>

            {/* Related Companies */}
            {article.relatedCompanies && article.relatedCompanies.length > 0 && (
              <Card className="mt-8 border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Related Companies</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.relatedCompanies.map((company) => (
                      <Link key={company} href={`/companies?search=${company}`}>
                        <Badge variant="outline" className="hover:bg-muted cursor-pointer">
                          {company}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
