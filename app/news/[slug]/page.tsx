'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { client, SanityArticle, articleBySlugQuery, urlFor } from '@/lib/sanity'
import { format } from 'date-fns'
import { Calendar, User, ArrowLeft, Share2, Building2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PortableText } from '@portabletext/react'

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

const portableTextComponents = {
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>
    ),
    normal: ({ children }: any) => <p className="mb-4 leading-7">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => (
      <div className="my-8 relative w-full">
        <div className="relative h-96 w-full rounded-lg overflow-hidden">
          <Image
            src={urlFor(value).width(1200).height(800).url()}
            alt={value.alt || 'Article image'}
            fill
            className="object-cover"
          />
        </div>
        {value.caption && (
          <p className="text-sm text-muted-foreground text-center mt-2">{value.caption}</p>
        )}
      </div>
    ),
  },
}

export default function ArticlePage() {
  const params = useParams()
  const slug = params?.slug as string
  const [article, setArticle] = useState<SanityArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return

      try {
        setLoading(true)
        const data = await client.fetch<SanityArticle>(articleBySlugQuery(slug))
        setArticle(data)
      } catch (error) {
        console.error('Failed to load article:', error)
      } finally {
        setLoading(false)
      }
    }
    loadArticle()
  }, [slug])

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
          <div className="animate-pulse space-y-8">
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
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">

        {/* Back Button */}
        <Link href="/news">
          <Button variant="ghost" className="mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to News
          </Button>
        </Link>

        {/* Article */}
        <article className="animate-fade-in">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-6">

              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2">
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
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={article.publishedAt}>
                    {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
                  </time>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Main Image */}
              {article.mainImage && (
                <div className="relative h-96 w-full rounded-lg overflow-hidden -mx-6 sm:mx-0">
                  <Image
                    src={urlFor(article.mainImage).width(1200).height(800).url()}
                    alt={article.mainImage.alt || article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </CardHeader>

            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <PortableText value={article.body} components={portableTextComponents} />
            </CardContent>

            {/* Related Companies */}
            {article.relatedCompanies && article.relatedCompanies.length > 0 && (
              <CardContent className="border-t border-border pt-6">
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
            )}
          </Card>
        </article>
      </div>
    </div>
  )
}
