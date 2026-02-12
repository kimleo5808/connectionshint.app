import { siteConfig } from '@/config/site'
import { getAllPuzzles } from '@/lib/connections-data'
import { getPosts } from '@/lib/getBlogs'
import { MetadataRoute } from 'next'

const siteUrl = siteConfig.url

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/connections-hint-today',
    '/how-to-play-connections',
    '/connections-hint-faq',
    '/connections-hint',
    '/about',
    '/privacy-policy',
    '/terms-of-service',
  ]

  const pages = staticPages.map(page => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: (page === '' || page === '/connections-hint-today' ? 'daily' : 'weekly') as ChangeFrequency,
    priority: page === '' ? 1.0 : page === '/connections-hint-today' ? 0.95 : 0.8,
  }))

  // Puzzle pages
  const allPuzzles = await getAllPuzzles()
  const puzzlePages = allPuzzles.map(puzzle => ({
    url: `${siteUrl}/connections-hint/${puzzle.date}`,
    lastModified: new Date(puzzle.date),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Blog pages
  const { posts } = await getPosts('en')

  const blogIndex = {
    url: `${siteUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily' as ChangeFrequency,
    priority: 0.7,
  }

  const postPages = posts
    .filter(post => Boolean(post.slug))
    .map(post => {
      const normalizedSlug = post.slug.startsWith('/') ? post.slug : `/${post.slug}`
      const postPath = normalizedSlug.startsWith('/blog/')
        ? normalizedSlug
        : `/blog${normalizedSlug}`

      return {
        url: `${siteUrl}${postPath}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.6,
      }
    })

  return [
    ...pages,
    ...puzzlePages,
    blogIndex,
    ...postPages,
  ]
}
