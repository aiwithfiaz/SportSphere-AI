# SEO Optimizer Skill

## Description
Optimize SportSphere AI for search engines with proper metadata, Schema.org markup, sitemaps, and performance improvements.

## When to Use
- Setting up page metadata
- Implementing Schema.org structured data
- Creating XML sitemaps
- Optimizing page titles and descriptions
- Adding Open Graph and Twitter cards
- Implementing canonical URLs

## Tech Stack
- **Framework**: Next.js 15 Metadata API
- **Structured Data**: Schema.org JSON-LD
- **Sitemaps**: Next.js sitemap generation
- **Analytics**: Vercel Analytics, Google Search Console

## File Structure
```
src/
├── app/
│   ├── layout.tsx            # Root metadata
│   ├── sitemap.ts            # Dynamic sitemap
│   ├── robots.ts             # Robots.txt
│   └── [slug]/
│       └── page.tsx          # Page with metadata
├── lib/
│   ├── seo/
│   │   ├── metadata.ts       # Metadata helpers
│   │   ├── schema.ts         # Schema.org generators
│   │   └── sitemap.ts        # Sitemap generators
│   └── config.ts             # Site configuration
└── components/
    └── seo/
        ├── json-ld.ts        # JSON-LD component
        ├── breadcrumbs.ts    # Breadcrumb navigation
        └── canonical.ts      # Canonical URL handler
```

## Metadata Configuration

### Root Layout Metadata
```tsx
// app/layout.tsx
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sportsphere.ai'),
  title: {
    default: 'SportSphere AI - Your Football Universe',
    template: '%s | SportSphere AI',
  },
  description:
    'Stay updated with live football scores, team news, transfers, and AI-powered predictions. Your ultimate football companion.',
  keywords: [
    'football',
    'soccer',
    'live scores',
    'transfers',
    'predictions',
    'Premier League',
    'Champions League',
  ],
  authors: [{ name: 'SportSphere AI' }],
  creator: 'SportSphere AI',
  publisher: 'SportSphere AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sportsphere.ai',
    siteName: 'SportSphere AI',
    title: 'SportSphere AI - Your Football Universe',
    description:
      'Stay updated with live football scores, team news, transfers, and AI-powered predictions.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SportSphere AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportSphere AI - Your Football Universe',
    description:
      'Stay updated with live football scores, team news, transfers, and AI-powered predictions.',
    images: ['/og-image.png'],
    creator: '@sportsphere',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://sportsphere.ai',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}
```

### Page-Level Metadata
```tsx
// app/teams/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const team = await db.team.findUnique({
    where: { slug },
    select: { name: true, description: true, logo: true, country: true, league: true },
  })

  if (!team) {
    return { title: 'Team Not Found' }
  }

  const title = `${team.name} - Team Profile, Stats & News`
  const description =
    team.description ||
    `Explore ${team.name}'s profile, statistics, squad, and latest news on SportSphere AI.`
  const url = `/teams/${slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: team.logo || '/og-team.png',
          width: 1200,
          height: 630,
          alt: team.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [team.logo || '/og-team.png'],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params
  const team = await db.team.findUnique({
    where: { slug },
    include: {
      players: true,
      _count: { select: { homeMatches: true, awayMatches: true } },
    },
  })

  if (!team) notFound()

  return (
    <div>
      <h1>{team.name}</h1>
      {/* JSON-LD for team */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsTeam',
            name: team.name,
            description: team.description,
            image: team.logo,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/teams/${slug}`,
            sport: 'Soccer',
            memberOf: {
              '@type': 'SportsOrganization',
              name: team.league,
            },
          }),
        }}
      />
    </div>
  )
}
```

## Schema.org Structured Data

### lib/seo/schema.ts
```typescript
export function generateArticleSchema(article: {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: { name: string; url?: string }
  publisher: { name: string; logo: string }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      },
    },
  }
}

export function generateMatchSchema(match: {
  name: string
  date: string
  location: string
  homeTeam: string
  awayTeam: string
  status: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: match.name,
    startDate: match.date,
    location: {
      '@type': 'Place',
      name: match.location,
    },
    competitor: [
      {
        '@type': 'SportsTeam',
        name: match.homeTeam,
      },
      {
        '@type': 'SportsTeam',
        name: match.awayTeam,
      },
    ],
    eventStatus: match.status,
    sport: 'Soccer',
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SportSphere AI',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/sportsphere',
      'https://facebook.com/sportsphere',
      'https://instagram.com/sportsphere',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@sportsphere.ai',
    },
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SportSphere AI',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
```

### JSON-LD Component
```tsx
// components/seo/json-ld.tsx
interface JsonLdProps {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Usage in page
import { JsonLd } from '@/components/seo/json-ld'
import { generateArticleSchema } from '@/lib/seo/schema'

export default function ArticlePage({ article }) {
  const schema = generateArticleSchema({
    title: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { name: article.author.name },
    publisher: {
      name: 'SportSphere AI',
      logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    },
  })

  return (
    <>
      <JsonLd data={schema} />
      <article>
        <h1>{article.title}</h1>
        {/* Article content */}
      </article>
    </>
  )
}
```

## Breadcrumbs
```tsx
// components/seo/breadcrumbs.tsx
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from './json-ld'
import { generateBreadcrumbSchema } from '@/lib/seo/schema'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = generateBreadcrumbSchema(
    items.map((item) => ({
      name: item.label,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`,
    }))
  )

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              <ChevronRight className="mx-2 h-4 w-4" />
              {index === items.length - 1 ? (
                <span className="text-foreground">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
```

## Sitemap Generation

### app/sitemap.ts
```typescript
import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportsphere.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${BASE_URL}/teams`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/matches`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.8 },
    { url: `${BASE_URL}/predictions`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
  ]

  // Dynamic team pages
  const teams = await db.team.findMany({
    select: { slug: true, updatedAt: true },
  })

  const teamPages = teams.map((team) => ({
    url: `${BASE_URL}/teams/${team.slug}`,
    lastModified: team.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic article pages
  const articles = await db.article.findMany({
    where: { published: true },
    select: { slug: true, publishedAt: true },
    orderBy: { publishedAt: 'desc' },
    take: 100,
  })

  const articlePages = articles.map((article) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: article.publishedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...teamPages, ...articlePages]
}
```

### app/robots.ts
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

## Canonical URLs

```tsx
// components/seo/canonical.tsx
import { headers } from 'next/headers'

interface CanonicalProps {
  path: string
}

export async function Canonical({ path }: CanonicalProps) {
  const headersList = await headers()
  const host = headersList.get('host') || 'sportsphere.ai'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const url = `${protocol}://${host}${path}`

  return <link rel="canonical" href={url} />
}
```

## Open Graph Image Generation

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'SportSphere AI'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 'bold',
              color: '#1e3a5f',
            }}
          >
            SS
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#94a3b8',
            marginTop: '20px',
          }}
        >
          SportSphere AI - Your Football Universe
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

## Common Pitfalls
1. **Missing Metadata** - Every page needs title and description
2. **Duplicate Content** - Use canonical URLs
3. **Slow Loading** - Optimize images and lazy load
4. **No Structured Data** - Add Schema.org for rich snippets
5. **Missing Sitemap** - Keep sitemap updated

## Best Practices
- Use unique titles and descriptions per page
- Implement proper heading hierarchy (h1 > h2 > h3)
- Add alt text to all images
- Use semantic HTML elements
- Optimize Core Web Vitals
- Implement lazy loading for images
- Use proper internal linking
- Monitor search console for errors
