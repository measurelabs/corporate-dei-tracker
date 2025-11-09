'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { client, SanityArticle, articlesQuery, featuredArticlesQuery, urlFor } from '@/lib/sanity'
import { formatDistanceToNow } from 'date-fns'
import { Newspaper, TrendingUp, Calendar, User, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { value: 'all', label: 'All Articles' },
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

export default function NewsPage() {
  const [articles, setArticles] = useState<SanityArticle[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<SanityArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true)
        const [allArticles, featured] = await Promise.all([
          client.fetch<SanityArticle[]>(articlesQuery),
          client.fetch<SanityArticle[]>(featuredArticlesQuery),
        ])
        setArticles(allArticles)
        setFeaturedArticles(featured)
      } catch (error) {
        console.error('Failed to load articles:', error)
      } finally {
        setLoading(false)
      }
    }
    loadArticles()
  }, [])

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((article) => article.category === selectedCategory)

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-10 sm:pb-12">
          <div className="max-w-5xl">
            <div className="inline-flex items-center rounded-md border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/50 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 mb-3 backdrop-blur-sm">
              <Newspaper className="w-3 h-3 mr-1.5" />
              News & Insights
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
              Latest Corporate DEI News & Analysis
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4 sm:mb-6">
              Stay informed with the latest developments, policy changes, and insights in corporate diversity, equity, and inclusion initiatives
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.value
                const colorVariant = category.value === 'all' ? 'outline' : getCategoryColor(category.value)

                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className="transition-all duration-200"
                  >
                    <Badge
                      variant={colorVariant as any}
                      className={`text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                        isSelected
                          ? 'scale-105 shadow-md'
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {category.label}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">

        {/* Featured Articles */}
        {!loading && featuredArticles.length > 0 && (
          <div className="mb-12 animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <h2 className="text-2xl font-bold">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link key={article._id} href={`/news/${article.slug.current}`}>
                  <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group bg-card/50 backdrop-blur-sm">
                    {article.mainImage && (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={urlFor(article.mainImage).width(600).height(400).url()}
                          alt={article.mainImage.alt || article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge
                          variant={getCategoryColor(article.category) as any}
                          className="text-xs"
                        >
                          {categories.find((c) => c.value === article.category)?.label || article.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Featured
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <User className="w-3 h-3" />
                        {article.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Articles Grid */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory === 'all' ? 'All Articles' : categories.find((c) => c.value === selectedCategory)?.label}
          </h2>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-card/50 border border-border rounded-lg animate-pulse backdrop-blur-sm"
                />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Newspaper className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Articles will appear here once they are published in Sanity CMS.
                  Get started by running <code className="bg-muted px-2 py-1 rounded">npm run sanity</code>
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link key={article._id} href={`/news/${article.slug.current}`}>
                  <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group bg-card/50 backdrop-blur-sm">
                    {article.mainImage && (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={urlFor(article.mainImage).width(600).height(400).url()}
                          alt={article.mainImage.alt || article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge
                          variant={getCategoryColor(article.category) as any}
                          className="text-xs"
                        >
                          {categories.find((c) => c.value === article.category)?.label || article.category}
                        </Badge>
                        {article.tags && article.tags.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {article.tags[0]}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <User className="w-3 h-3" />
                        {article.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
