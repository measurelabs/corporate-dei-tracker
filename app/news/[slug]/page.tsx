import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { client, SanityArticle, articleBySlugQuery, urlFor } from '@/lib/sanity'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ArticleContent } from './ArticleContent'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for the article page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const article = await client.fetch<SanityArticle>(articleBySlugQuery(slug))

    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      }
    }

    const title = article.metaTitle || article.title
    const description = article.metaDescription || article.excerpt
    const imageUrl = article.mainImage
      ? urlFor(article.mainImage).width(1200).height(630).url()
      : undefined

    return {
      title: `${title} | MEASURE Labs News`,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.author],
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: article.mainImage?.alt || title }] : [],
        tags: article.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
      keywords: article.tags?.join(', '),
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Article | MEASURE Labs News',
      description: 'Track corporate diversity, equity, and inclusion commitments.',
    }
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  let article: SanityArticle | null = null
  let loading = false

  try {
    article = await client.fetch<SanityArticle>(articleBySlugQuery(slug))
  } catch (err) {
    console.error('Failed to load article:', err)
  }

  // Loading state (this would only show during static generation)
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

  // Article not found
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

  return <ArticleContent article={article} />
}
