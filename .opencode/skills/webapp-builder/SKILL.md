# Webapp Builder Skill

## Description
Build and architect full-stack web applications using Next.js 15 App Router, React 19, and TypeScript for SportSphere AI.

## When to Use
- Creating new pages or route segments
- Setting up layouts and nested layouts
- Configuring Next.js App Router features
- Implementing React Server Components (RSC)
- Setting up client components with 'use client'
- Implementing data fetching patterns

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **React**: React 19 with Server Components
- **Language**: TypeScript 5.5+
- **Styling**: Tailwind CSS 4 + Shadcn UI
- **State**: Zustand + React hooks

## Key Patterns

### App Router Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── (auth)/             # Route group (no URL segment)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/        # Protected routes
│   │   ├── layout.tsx      # Dashboard layout
│   │   ├── teams/page.tsx
│   │   └── matches/page.tsx
│   ├── api/                # API routes
│   │   └── v1/
│   │       ├── teams/route.ts
│   │       └── matches/route.ts
│   ├── [slug]/             # Dynamic routes
│   │   └── page.tsx
│   └── [...catchAll]/      # Catch-all routes
│       └── page.tsx
├── components/
│   ├── ui/                 # Shadcn components
│   ├── layout/             # Layout components
│   └── features/           # Feature-specific components
├── lib/
│   ├── utils.ts
│   └── validations.ts
├── hooks/
├── types/
└── styles/
```

### React Server Components (Default)
```tsx
// app/teams/page.tsx - Server Component (no 'use client')
import { db } from '@/lib/db'
import { TeamCard } from '@/components/features/team-card'

export default async function TeamsPage() {
  // Direct database access in Server Components
  const teams = await db.team.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Football Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}
```

### Client Components (When Needed)
```tsx
'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { addToFavorites } from '@/app/actions/teams'

export function FavoriteButton({ teamId, isFavorited }) {
  const [optimisticFav, setOptimisticFav] = useState(isFavorited)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      setOptimisticFav(!optimisticFav)
      await addToFavorites(teamId)
    })
  }

  return (
    <Button
      onClick={handleClick}
      variant={optimisticFav ? 'default' : 'outline'}
      disabled={isPending}
    >
      {optimisticFav ? '★ Favorited' : '☆ Add to Favorites'}
    </Button>
  )
}
```

### Server Actions
```tsx
// app/actions/matches.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { matchSchema } from '@/lib/validations'

export async function createMatch(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = matchSchema.parse({
    homeTeam: formData.get('homeTeam'),
    awayTeam: formData.get('awayTeam'),
    date: formData.get('date'),
    venue: formData.get('venue'),
  })

  const match = await db.match.create({
    data: {
      ...validated,
      createdById: session.user.id,
    },
  })

  revalidatePath('/matches')
  redirect(`/matches/${match.id}`)
}

export async function updateScore(matchId: string, homeScore: number, awayScore: number) {
  await db.match.update({
    where: { id: matchId },
    data: { homeScore, awayScore, status: 'FINISHED' },
  })

  revalidatePath('/matches')
  revalidatePath(`/matches/${matchId}`)
}
```

### Data Fetching Patterns
```tsx
// Parallel data fetching
async function getTeamAndPlayers(teamId: string) {
  const [team, players, stats] = await Promise.all([
    db.team.findUnique({ where: { id: teamId } }),
    db.player.findMany({ where: { teamId } }),
    getTeamStats(teamId),
  ])

  return { team, players, stats }
}

// Streaming with Suspense
import { Suspense } from 'react'
import { MatchList } from '@/components/features/match-list'
import { MatchListSkeleton } from '@/components/ui/skeletons'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<MatchListSkeleton />}>
        <MatchList />
      </Suspense>
    </div>
  )
}
```

### Layout Patterns
```tsx
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

## Configuration Files

### next.config.ts
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
```

### tsconfig.json (Key Paths)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

## Common Pitfalls
1. **Mixing Server/Client Components** - Keep server components as default, only add 'use client' when state/effects needed
2. **Serialization Issues** - Server components can't pass functions to client components
3. **Hydration Mismatches** - Avoid browser-only APIs in server components
4. **Missing Loading States** - Always add loading.tsx for async routes
5. **No Error Boundaries** - Add error.tsx for each route segment

## Best Practices
- Use Server Components by default
- Minimize client-side JavaScript bundle
- Use Route Groups for logical grouping
- Implement proper loading and error states
- Use Server Actions for mutations
- Leverage Streaming and Suspense
- Cache data appropriately with revalidatePath
