# Performance Engineer Skill

## Description
Optimize SportSphere AI for speed, efficiency, and scalability with caching, CDN, and performance monitoring.

## When to Use
- Optimizing page load times
- Implementing caching strategies
- Setting up CDN configuration
- Monitoring Core Web Vitals
- Optimizing images and assets
- Implementing lazy loading

## Tech Stack
- **Caching**: Redis, Next.js cache
- **CDN**: Vercel Edge Network
- **Images**: Next.js Image Optimization
- **Monitoring**: Vercel Analytics, Web Vitals
- **Compression**: Brotli, Gzip

## File Structure
```
src/
├── lib/
│   ├── cache/
│   │   ├── redis.ts          # Redis client
│   │   ├── tags.ts           # Cache tags
│   │   └── strategies.ts     # Caching strategies
│   ├── performance/
│   │   ├── metrics.ts        # Performance metrics
│   │   └── optimize.ts       # Optimization helpers
│   └── config.ts
├── hooks/
│   └── use-performance.ts    # Performance hooks
└── components/
    └── performance/
        ├── lazy-load.tsx     # Lazy loading wrapper
        └── image-optimized.tsx
```

## Caching Strategies

### Redis Client
```typescript
// lib/cache/redis.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export default redis

// Cache with TTL
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key)
    return data
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttl })
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Cache delete error:', error)
  }
}

// Cache with tags for bulk invalidation
export async function getCacheWithTags<T>(
  key: string
): Promise<T | null> {
  return getCache<T>(key)
}

export async function setCacheWithTags<T>(
  key: string,
  value: T,
  tags: string[],
  ttl: number = 3600
): Promise<void> {
  await setCache(key, value, ttl)
  
  // Store tag -> keys mapping
  for (const tag of tags) {
    await redis.sadd(`tag:${tag}`, key)
    await redis.expire(`tag:${tag}`, ttl)
  }
}

export async function invalidateTag(tag: string): Promise<void> {
  const keys = await redis.smembers(`tag:${tag}`)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
  await redis.del(`tag:${tag}`)
}
```

### Caching Strategies
```typescript
// lib/cache/strategies.ts
import { cache } from 'react'
import redis from './redis'

// Strategy 1: Cache-Aside (Lazy Loading)
export async function cacheAside<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get<T>(key)
  if (cached) {
    return cached
  }

  // Fetch from source
  const data = await fetchFn()

  // Store in cache
  await redis.set(key, data, { ex: ttl })

  return data
}

// Strategy 2: Write-Through
export async function writeThrough<T>(
  key: string,
  fetchFn: () => Promise<T>,
  updateFn: (data: T) => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Update source first
  const updatedData = await updateFn(await fetchFn())

  // Update cache
  await redis.set(key, updatedData, { ex: ttl })

  return updatedData
}

// Strategy 3: Stale-While-Revalidate
export async function staleWhileRevalidate<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600,
  staleTtl: number = 600
): Promise<T> {
  const cached = await redis.get<{
    data: T
    timestamp: number
  }>(key)

  if (cached) {
    const age = Date.now() - cached.timestamp

    // If fresh, return immediately
    if (age < ttl) {
      return cached.data
    }

    // If stale but within stale window, return and revalidate in background
    if (age < ttl + staleTtl) {
      // Background revalidation
      fetchFn().then(async (freshData) => {
        await redis.set(
          key,
          { data: freshData, timestamp: Date.now() },
          { ex: ttl + staleTtl }
        )
      })
      return cached.data
    }
  }

  // Fetch fresh data
  const data = await fetchFn()
  await redis.set(
    key,
    { data, timestamp: Date.now() },
    { ex: ttl + staleTtl }
  )

  return data
}

// React cache() for request deduplication
export const getCachedTeam = cache(async (slug: string) => {
  return cacheAside(
    `team:${slug}`,
    () => db.team.findUnique({ where: { slug } }),
    3600
  )
})

export const getCachedMatch = cache(async (id: string) => {
  return cacheAside(
    `match:${id}`,
    () => db.match.findUnique({ where: { id } }),
    300 // 5 minutes for live matches
  )
})
```

## Next.js Caching

### Route Segment Config
```typescript
// app/teams/[slug]/page.tsx

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

// OR: Static with revalidation
export const revalidate = 3600 // Revalidate every hour

// OR: On-demand revalidation
export const revalidate = false

// Cache tags for on-demand revalidation
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
```

### Data Fetching with Cache
```typescript
// lib/api/cached-fetch.ts
import { unstable_cache } from 'next/cache'

// Cache with tags
export const getTeams = unstable_cache(
  async () => {
    return db.team.findMany({
      include: { _count: { select: { players: true } } },
    })
  },
  ['teams'],
  {
    revalidate: 3600,
    tags: ['teams'],
  }
)

// On-demand revalidation
import { revalidateTag } from 'next/cache'

export async function revalidateTeams() {
  revalidateTag('teams')
}

// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const { tag, secret } = await request.json()

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag(tag)
  return NextResponse.json({ revalidated: true })
}
```

## Image Optimization

### Optimized Image Component
```tsx
// components/performance/image-optimized.tsx
'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder.png',
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
        setError(true)
      }}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    />
  )
}

// Usage
<OptimizedImage
  src={team.logo}
  alt={team.name}
  width={200}
  height={200}
  className="rounded-full"
  priority={isAboveFold}
/>
```

### Image Configuration
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
```

## Lazy Loading

### Lazy Load Component
```tsx
// components/performance/lazy-load.tsx
'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface LazyLoadProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
}

export function LazyLoad({
  children,
  fallback = null,
  rootMargin = '100px',
  threshold = 0,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return <div ref={ref}>{isVisible ? children : fallback}</div>
}

// Dynamic import wrapper
import dynamic from 'next/dynamic'

const LazyChart = dynamic(() => import('@/components/charts/team-stats'), {
  loading: () => <div className="h-64 bg-muted animate-pulse" />,
  ssr: false,
})

export function TeamStatsChart({ teamId }: { teamId: string }) {
  return (
    <LazyLoad fallback={<div className="h-64 bg-muted animate-pulse" />}>
      <LazyChart teamId={teamId} />
    </LazyLoad>
  )
}
```

## Performance Monitoring

### Core Web Vitals
```typescript
// hooks/use-performance.ts
'use client'

import { useEffect } from 'react'

export function usePerformanceMetrics() {
  useEffect(() => {
    // Report Core Web Vitals
    function reportWebVitals(metric: any) {
      console.log(metric)
      
      // Send to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: metric.name === 'CLS' ? metric.value * 1000 : metric.value,
          non_interaction: true,
        })
      }
    }

    // Dynamic import for web-vitals
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals)
      onFID(reportWebVitals)
      onFCP(reportWebVitals)
      onLCP(reportWebVitals)
      onTTFB(reportWebVitals)
    })
  }, [])
}
```

### Performance Utilities
```typescript
// lib/performance/optimize.ts

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Virtual scrolling helper
export function calculateVirtualScroll(
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number
) {
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    totalItems
  )
  const offsetY = startIndex * itemHeight

  return { startIndex, endIndex, offsetY }
}
```

## Common Pitfalls
1. **Over-caching** - Stale data can cause issues
2. **Missing Cache Invalidation** - Data becomes outdated
3. **Large Bundle Size** - Too many dependencies
4. **Unoptimized Images** - Slow loading
5. **No Lazy Loading** - Initial load too heavy

## Best Practices
- Use CDN for static assets
- Implement proper cache headers
- Optimize images with Next.js Image
- Use dynamic imports for heavy components
- Monitor Core Web Vitals
- Implement progressive loading
- Use Redis for shared caching
- Set appropriate cache TTLs
