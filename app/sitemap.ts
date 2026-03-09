import { siteConfig } from '@/config/site'
import { GUIDES } from '@/data/guides'
import { PATTERN_PAGE_CONFIGS } from '@/data/pattern-pages'
import { getAllPuzzles, getAvailableMonths } from '@/lib/connections-data'
import { getPosts } from '@/lib/getBlogs'
import { MetadataRoute } from 'next'

const siteUrl = siteConfig.url

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/connections-hint-today',
    '/connections-hint-yesterday',
    '/connections-difficulty',
    '/connections-patterns',
    '/how-to-play-connections',
    '/connections-hint-faq',
    '/connections-hint',
    '/about',
    '/contact',
    '/share',
    '/privacy-policy',
    '/terms-of-service',
  ]

  const pages = staticPages.map(page => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: (page === '' || page === '/connections-hint-today' ? 'daily' : 'weekly') as ChangeFrequency,
    priority: page === '' ? 1.0 : page === '/connections-hint-today' ? 0.95 : 0.8,
  }))

  // Letter pages (4-11 letters)
  const letterPages = [4, 5, 6, 7, 8, 9, 10, 11].map(n => ({
    url: `${siteUrl}/${n}-letters`,
    lastModified: new Date(),
    changeFrequency: 'daily' as ChangeFrequency,
    priority: 0.6,
  }))

  // Guide pages
  const guidesIndex = {
    url: `${siteUrl}/guides`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
  }

  const guidePages = GUIDES.map(guide => ({
    url: `${siteUrl}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.7,
  }))

  // Puzzle pages
  const allPuzzles = await getAllPuzzles()
  const puzzlePages = allPuzzles.map(puzzle => ({
    url: `${siteUrl}/connections-hint/${puzzle.date}`,
    lastModified: new Date(puzzle.date),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  const puzzleNumberPages = allPuzzles.map(puzzle => ({
    url: `${siteUrl}/connections-number/${puzzle.id}`,
    lastModified: new Date(puzzle.date),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.55,
  }))

  const months = await getAvailableMonths()
  const monthPages = months.map(yearMonth => ({
    url: `${siteUrl}/connections-hint/${yearMonth.slice(0, 4)}/${yearMonth.slice(5, 7)}`,
    lastModified: new Date(`${yearMonth}-01`),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.65,
  }))

  const patternPages = PATTERN_PAGE_CONFIGS.map(page => ({
    url: `${siteUrl}/connections-patterns/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.7,
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
    ...letterPages,
    guidesIndex,
    ...guidePages,
    ...puzzlePages,
    ...puzzleNumberPages,
    ...monthPages,
    ...patternPages,
    blogIndex,
    ...postPages,
  ]
}
