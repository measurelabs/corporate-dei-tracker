import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Type definitions for Sanity article
export interface SanityArticle {
  _id: string
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  author: string
  mainImage?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  category: string
  tags?: string[]
  publishedAt: string
  excerpt: string
  metaTitle?: string
  metaDescription?: string
  body: any[]
  featured?: boolean
  relatedCompanies?: string[]
}

// GROQ queries
export const articlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  author,
  mainImage,
  category,
  tags,
  publishedAt,
  excerpt,
  featured,
  relatedCompanies
}`

export const featuredArticlesQuery = `*[_type == "article" && featured == true] | order(publishedAt desc)[0...3] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  author,
  mainImage,
  category,
  tags,
  publishedAt,
  excerpt,
  featured,
  relatedCompanies
}`

export const articleBySlugQuery = (slug: string) => `*[_type == "article" && slug.current == "${slug}"][0] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  author,
  mainImage,
  category,
  tags,
  publishedAt,
  excerpt,
  metaTitle,
  metaDescription,
  body,
  featured,
  relatedCompanies
}`

export const articlesByCategoryQuery = (category: string) => `*[_type == "article" && category == "${category}"] | order(publishedAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  author,
  mainImage,
  category,
  tags,
  publishedAt,
  excerpt,
  featured,
  relatedCompanies
}`
