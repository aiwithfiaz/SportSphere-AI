# Database Builder Skill

## Description
Design, implement, and optimize PostgreSQL databases using Prisma ORM for SportSphere AI's data layer.

## When to Use
- Designing database schemas and models
- Creating or modifying Prisma migrations
- Writing database queries and optimizations
- Setting up database seeding
- Configuring database connections
- Performance tuning queries

## Tech Stack
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.x
- **Validation**: Zod schemas
- **Migrations**: Prisma Migrate

## Prisma Schema Structure

### prisma/schema.prisma
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "metrics"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Base model with common fields
model BaseEntity {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("base_entity")
}

// User model
model User extends BaseEntity {
  name            String?
  email           String?   @unique
  emailVerified   DateTime?
  image           String?
  role            UserRole  @default(USER)
  favoriteTeamId  String?

  favoriteTeam  Team?     @relation(fields: [favoriteTeamId], references: [id])
  accounts      Account[]
  sessions      Session[]
  articles      Article[] @relation("ArticleAuthor")
  comments      Comment[]
  predictions   Prediction[]
  predictions   Prediction[]

  @@index([email])
  @@map("users")
}

enum UserRole {
  USER
  ADMIN
  EDITOR
  MODERATOR
}

// Team model
model Team extends BaseEntity {
  name            String
  slug            String    @unique
  shortName       String?
  logo            String?
  stadium         String?
  founded         Int?
  country         String    @default("England")
  league          String    @default("Premier League")
  website         String?
  description     String?

  players         Player[]
  homeMatches     Match[]   @relation("HomeTeam")
  awayMatches     Match[]   @relation("AwayTeam")
  newsArticles    Article[]
  fans            User[]

  @@index([slug])
  @@index([country, league])
  @@map("teams")
}

// Player model
model Player extends BaseEntity {
  firstName       String
  lastName        String
  dateOfBirth     DateTime
  nationality     String
  position        PlayerPosition
  jerseyNumber    Int?
  photo           String?
  height          Float?     // in cm
  weight          Float?     // in kg
  marketValue     Decimal?   @db.Decimal(12, 2)
  teamId          String

  team            Team       @relation(fields: [teamId], references: [id])
  statistics      PlayerStat[]

  @@index([teamId])
  @@index([position])
  @@map("players")
}

enum PlayerPosition {
  GOALKEEPER
  DEFENDER
  MIDFIELDER
  FORWARD
}

// Match model
model Match extends BaseEntity {
  homeTeamId      String
  awayTeamId      String
  homeScore       Int?       @default(0)
  awayScore       Int?       @default(0)
  date            DateTime
  status          MatchStatus @default(SCHEDULED)
  venue           String?
  referee         String?
  attendance      Int?
  season          String
  matchday        Int?

  homeTeam        Team       @relation("HomeTeam", fields: [homeTeamId], references: [id])
  awayTeam        Team       @relation("AwayTeam", fields: [awayTeamId], references: [id])
  events          MatchEvent[]
  lineups         Lineup[]
  predictions     Prediction[]

  @@index([date])
  @@index([homeTeamId, awayTeamId])
  @@index([status])
  @@map("matches")
}

enum MatchStatus {
  SCHEDULED
  IN_PROGRESS
  HALFTIME
  FINISHED
  POSTPONED
  CANCELLED
}

// Match Events
model MatchEvent extends BaseEntity {
  matchId         String
  playerId        String
  teamId          String
  eventType       EventType
  minute          Int
  description     String?
  additionalInfo  Json?

  match           Match      @relation(fields: [matchId], references: [id])

  @@index([matchId])
  @@index([playerId])
  @@map("match_events")
}

enum EventType {
  GOAL
  OWN_GOAL
  PENALTY
  MISS_PENALTY
  YELLOW_CARD
  RED_CARD
  SUBSTITUTION
  VAR_REVIEW
}

// News/Articles model
model Article extends BaseEntity {
  title           String
  slug            String    @unique
  excerpt         String?
  content         String    @db.Text
  coverImage      String?
  category        ArticleCategory @default(NEWS)
  tags            String[]
  published       Boolean   @default(false)
  publishedAt     DateTime?
  authorId        String
  teamId          String?

  author          User      @relation("ArticleAuthor", fields: [authorId], references: [id])
  team            Team?     @relation(fields: [teamId], references: [id])
  comments        Comment[]

  @@index([slug])
  @@index([published, publishedAt])
  @@index([category])
  @@map("articles")
}

enum ArticleCategory {
  NEWS
  TRANSFER
  MATCH_REPORT
  ANALYSIS
  OPINION
  INTERVIEW
}

// Predictions
model Prediction extends BaseEntity {
  userId          String
  matchId         String
  homeScore       Int
  awayScore       Int
  points          Int?      @default(0)
  isCorrect       Boolean?

  user            User      @relation(fields: [userId], references: [id])
  match           Match     @relation(fields: [matchId], references: [id])

  @@unique([userId, matchId])
  @@index([matchId])
  @@map("predictions")
}

// Player Statistics
model PlayerStat extends BaseEntity {
  playerId        String
  season          String
  appearances     Int       @default(0)
  goals           Int       @default(0)
  assists         Int       @default(0)
  yellowCards     Int       @default(0)
  redCards        Int       @default(0)
  minutesPlayed   Int       @default(0)
  cleanSheets     Int       @default(0)  // For goalkeepers
  additionalStats Json?

  player          Player    @relation(fields: [playerId], references: [id])

  @@unique([playerId, season])
  @@map("player_stats")
}
```

## Common Queries

### Complex Queries with Prisma
```typescript
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

// Advanced team query with aggregations
export async function getTeamWithStats(teamId: string) {
  return db.team.findUnique({
    where: { id: teamId },
    include: {
      players: {
        include: {
          statistics: {
            where: { season: '2024-25' },
          },
        },
        orderBy: { jerseyNumber: 'asc' },
      },
      _count: {
        select: {
          homeMatches: true,
          awayMatches: true,
          fans: true,
        },
      },
    },
  })
}

// Paginated match results
export async function getMatchResults(
  page: number = 1,
  pageSize: number = 20,
  filters?: {
    teamId?: string
    status?: MatchStatus
    dateFrom?: Date
    dateTo?: Date
  }
) {
  const where: Prisma.MatchWhereInput = {
    status: 'FINISHED',
    ...filters?.teamId && {
      OR: [
        { homeTeamId: filters.teamId },
        { awayTeamId: filters.teamId },
      ],
    },
    ...filters?.dateFrom && { date: { gte: filters.dateFrom } },
    ...filters?.dateTo && { date: { lte: filters.dateTo } },
  }

  const [matches, total] = await Promise.all([
    db.match.findMany({
      where,
      include: {
        homeTeam: { select: { id: true, name: true, logo: true } },
        awayTeam: { select: { id: true, name: true, logo: true } },
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.match.count({ where }),
  ])

  return {
    matches,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}

// Full-text search
export async function searchPlayers(query: string) {
  return db.player.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      team: { select: { name: true, logo: true } },
    },
    take: 10,
  })
}

// Aggregate statistics
export async function getLeagueStats() {
  const stats = await db.$transaction([
    db.team.count(),
    db.player.count(),
    db.match.count({ where: { status: 'FINISHED' } }),
    db.match.aggregate({
      _sum: { homeScore: true, awayScore: true },
      where: { status: 'FINISHED' },
    }),
  ])

  return {
    totalTeams: stats[0],
    totalPlayers: stats[1],
    totalMatches: stats[2],
    totalGoals: (stats[3]._sum.homeScore ?? 0) + (stats[3]._sum.awayScore ?? 0),
  }
}
```

### Database Transactions
```typescript
// Complex transaction for match update
export async function updateMatchWithEvents(
  matchId: string,
  events: MatchEvent[],
  finalScore: { home: number; away: number }
) {
  return db.$transaction(async (tx) => {
    // Update match score
    const match = await tx.match.update({
      where: { id: matchId },
      data: {
        homeScore: finalScore.home,
        awayScore: finalScore.away,
        status: 'FINISHED',
      },
    })

    // Create match events
    await tx.matchEvent.createMany({
      data: events.map((event) => ({
        ...event,
        matchId,
      })),
    })

    // Update player statistics
    for (const event of events) {
      if (event.eventType === 'GOAL') {
        await tx.playerStat.upsert({
          where: {
            playerId_season: {
              playerId: event.playerId,
              season: '2024-25',
            },
          },
          create: {
            playerId: event.playerId,
            season: '2024-25',
            goals: 1,
          },
          update: {
            goals: { increment: 1 },
          },
        })
      }
    }

    return match
  })
}
```

## Database Seeding

### prisma/seed.ts
```typescript
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sportsphere.ai' },
    update: {},
    create: {
      email: 'admin@sportsphere.ai',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  // Create teams
  const teams = [
    { name: 'Arsenal', slug: 'arsenal', shortName: 'ARS', country: 'England', league: 'Premier League' },
    { name: 'Chelsea', slug: 'chelsea', shortName: 'CHE', country: 'England', league: 'Premier League' },
    { name: 'Liverpool', slug: 'liverpool', shortName: 'LIV', country: 'England', league: 'Premier League' },
    { name: 'Manchester City', slug: 'manchester-city', shortName: 'MCI', country: 'England', league: 'Premier League' },
    { name: 'Manchester United', slug: 'manchester-united', shortName: 'MUN', country: 'England', league: 'Premier League' },
    { name: 'Tottenham', slug: 'tottenham', shortName: 'TOT', country: 'England', league: 'Premier League' },
  ]

  for (const teamData of teams) {
    await prisma.team.upsert({
      where: { slug: teamData.slug },
      update: {},
      create: teamData,
    })
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## Migration Patterns

### Creating Migrations
```bash
# Create new migration
npx prisma migrate dev --name add_player_stats

# Reset database
npx prisma migrate reset

# Deploy to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Migration File Example
```sql
-- Migration: Add player statistics table
CREATE TABLE "player_stats" (
  "id" TEXT NOT NULL,
  "player_id" TEXT NOT NULL,
  "season" TEXT NOT NULL,
  "appearances" INTEGER NOT NULL DEFAULT 0,
  "goals" INTEGER NOT NULL DEFAULT 0,
  "assists" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "player_stats_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "player_stats_player_id_season_key" ON "player_stats"("player_id", "season");
CREATE INDEX "player_stats_player_id_idx" ON "player_stats"("player_id");
```

## Common Pitfalls
1. **N+1 Queries** - Use include/select to batch related data
2. **Missing Indexes** - Add indexes on frequently queried fields
3. **Transaction Scope** - Keep transactions short to avoid locks
4. **Connection Pooling** - Use connection pooling in production
5. **Data Validation** - Validate at application level before DB

## Best Practices
- Use Prisma's `include` for eager loading
- Add proper indexes for query performance
- Use transactions for multi-step operations
- Keep schema migrations backward compatible
- Use `select` to limit returned fields
- Implement proper error handling for DB operations
- Use Prisma's `findFirst` over `findMany` for single records
