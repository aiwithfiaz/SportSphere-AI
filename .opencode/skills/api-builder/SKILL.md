# API Builder Skill

## Description
Build robust REST APIs and WebSocket endpoints using Next.js 15 Route Handlers for SportSphere AI.

## When to Use
- Creating API endpoints
- Implementing CRUD operations
- Setting up WebSocket connections
- Adding API validation and error handling
- Implementing rate limiting
- Creating webhook handlers

## Tech Stack
- **Runtime**: Next.js 15 Route Handlers
- **Validation**: Zod schemas
- **Database**: Prisma ORM
- **Real-time**: Socket.io or native WebSocket
- **Auth**: NextAuth.js

## File Structure
```
src/
├── app/
│   └── api/
│       └── v1/
│           ├── teams/
│           │   ├── route.ts           # GET /api/v1/teams, POST /api/v1/teams
│           │   └── [id]/
│           │       ├── route.ts       # GET /api/v1/teams/:id, PUT, DELETE
│           │       └── players/
│           │           └── route.ts
│           ├── matches/
│           │   ├── route.ts
│           │   └── [id]/
│           │       └── route.ts
│           ├── players/
│           │   ├── route.ts
│           │   └── [id]/
│           │       └── route.ts
│           └── health/
│               └── route.ts
├── lib/
│   ├── api/
│   │   ├── errors.ts          # API error classes
│   │   ├── response.ts        # Response helpers
│   │   └── validate.ts        # Request validation
│   └── websocket/
│       └── server.ts          # WebSocket server
└── types/
    └── api.ts                 # API response types
```

## Route Handler Patterns

### Basic CRUD Operations
```typescript
// app/api/v1/teams/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { teamSchema, teamQuerySchema } from '@/lib/validations'
import { APIError, handleAPIError } from '@/lib/api/errors'
import { paginate } from '@/lib/api/response'

// GET /api/v1/teams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = teamQuerySchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      search: searchParams.get('search'),
      league: searchParams.get('league'),
    })

    const where = {
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { shortName: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
      ...(query.league && { league: query.league }),
    }

    const [teams, total] = await Promise.all([
      db.team.findMany({
        where,
        include: {
          _count: { select: { players: true } },
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { name: 'asc' },
      }),
      db.team.count({ where }),
    ])

    return NextResponse.json(
      paginate(teams, total, query.page, query.limit)
    )
  } catch (error) {
    return handleAPIError(error)
  }
}

// POST /api/v1/teams
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new APIError(401, 'Unauthorized')
    }

    const body = await request.json()
    const validated = teamSchema.parse(body)

    const team = await db.team.create({
      data: validated,
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    return handleAPIError(error)
  }
}
```

### Dynamic Route Handlers
```typescript
// app/api/v1/teams/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { teamSchema } from '@/lib/validations'
import { APIError, handleAPIError } from '@/lib/api/errors'

type Params = { params: Promise<{ id: string }> }

// GET /api/v1/teams/:id
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const team = await db.team.findUnique({
      where: { id },
      include: {
        players: {
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

    if (!team) {
      throw new APIError(404, 'Team not found')
    }

    return NextResponse.json(team)
  } catch (error) {
    return handleAPIError(error)
  }
}

// PUT /api/v1/teams/:id
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new APIError(401, 'Unauthorized')
    }

    const { id } = await params
    const body = await request.json()
    const validated = teamSchema.partial().parse(body)

    const team = await db.team.update({
      where: { id },
      data: validated,
    })

    return NextResponse.json(team)
  } catch (error) {
    return handleAPIError(error)
  }
}

// DELETE /api/v1/teams/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new APIError(401, 'Unauthorized')
    }

    const { id } = await params

    await db.team.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Team deleted' })
  } catch (error) {
    return handleAPIError(error)
  }
}
```

## API Utilities

### Error Handling
```typescript
// lib/api/errors.ts
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Zod validation error
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation Error',
        details: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    )
  }

  // Custom API error
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
      },
      { status: error.statusCode }
    )
  }

  // Prisma known errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          { error: 'Resource already exists' },
          { status: 409 }
        )
      case 'P2025':
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
      default:
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        )
    }
  }

  // Unknown error
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  )
}
```

### Response Helpers
```typescript
// lib/api/response.ts
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}

export function successResponse<T>(data: T, status = 200) {
  return Response.json({ data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}
```

### Request Validation
```typescript
// lib/api/validate.ts
import { ZodSchema, ZodError } from 'zod'
import { APIError } from './errors'

export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new APIError(400, 'Validation failed', error.errors)
    }
    throw error
  }
}

export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries())
  return schema.parse(params)
}
```

## WebSocket Implementation

### Socket.io Server
```typescript
// lib/websocket/server.ts
import { Server } from 'socket.io'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@/lib/auth'

export function configureSocketServer(res: NextApiResponse, req: NextApiRequest) {
  const io = new Server(res.socket.server, {
    path: '/api/socketio',
    addTrailingSlash: false,
  })

  io.on('connection', async (socket) => {
    // Authenticate socket connection
    const session = await auth({ req })
    if (!session?.user) {
      socket.disconnect()
      return
    }

    console.log('Client connected:', session.user.id)

    // Join user-specific room
    socket.join(`user:${session.user.id}`)

    // Match room for live updates
    socket.on('join:match', (matchId: string) => {
      socket.join(`match:${matchId}`)
    })

    socket.on('leave:match', (matchId: string) => {
      socket.leave(`match:${matchId}`)
    })

    // Handle predictions
    socket.on('prediction:submit', async (data) => {
      // Process prediction
      io.to(`match:${data.matchId}`).emit('prediction:new', {
        userId: session.user.id,
        prediction: data,
      })
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', session.user.id)
    })
  })

  return io
}

// Emit to specific match room
export function emitMatchUpdate(matchId: string, event: string, data: any) {
  // This would be called from server actions
  // Implementation depends on how you access the io instance
}
```

### WebSocket Client Hook
```typescript
// hooks/use-socket.ts
'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(matchId?: string) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = io({
      path: '/api/socketio',
      addTrailingSlash: false,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    if (matchId) {
      socket.emit('join:match', matchId)
    }

    return () => {
      if (matchId) {
        socket.emit('leave:match', matchId)
      }
      socket.disconnect()
    }
  }, [matchId])

  return {
    socket: socketRef.current,
    isConnected,
  }
}
```

## Rate Limiting

### Middleware Rate Limiting
```typescript
// lib/api/rate-limit.ts
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

export async function rateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    )
  }

  return null
}
```

## API Documentation

### OpenAPI/Swagger Setup
```typescript
// app/api/v1/docs/route.ts
import { NextResponse } from 'next/server'

const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'SportSphere AI API',
    version: '1.0.0',
    description: 'REST API for SportSphere AI football platform',
  },
  servers: [
    { url: 'http://localhost:3000/api/v1', description: 'Development' },
  ],
  paths: {
    '/teams': {
      get: {
        summary: 'Get all teams',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          '200': { description: 'List of teams' },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(swaggerDoc)
}
```

## Common Pitfalls
1. **Missing Error Handling** - Always wrap handlers in try-catch
2. **No Input Validation** - Validate all request bodies with Zod
3. **Authentication Bypass** - Check auth before mutations
4. **SQL Injection** - Use Prisma's parameterized queries
5. **CORS Issues** - Configure proper headers if needed

## Best Practices
- Use consistent response formats
- Implement proper HTTP status codes
- Add request validation with Zod
- Use middleware for auth and rate limiting
- Document API endpoints
- Version your API (/api/v1/)
- Handle errors gracefully
- Use TypeScript for type safety
