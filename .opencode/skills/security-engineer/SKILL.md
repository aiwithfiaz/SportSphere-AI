# Security Engineer Skill

## Description
Harden SportSphere AI against security vulnerabilities with CSP, rate limiting, input sanitization, and security best practices.

## When to Use
- Implementing Content Security Policy
- Setting up rate limiting
- Sanitizing user inputs
- Configuring CORS headers
- Handling authentication securely
- Preventing XSS, CSRF, and injection attacks

## Tech Stack
- **CSP**: Next.js headers configuration
- **Rate Limiting**: Upstash Redis
- **Validation**: Zod schemas
- **Auth**: NextAuth.js with secure defaults
- **Sanitization**: DOMPurify

## File Structure
```
src/
├── lib/
│   ├── security/
│   │   ├── csp.ts            # Content Security Policy
│   │   ├── rate-limit.ts     # Rate limiting
│   │   ├── sanitize.ts       # Input sanitization
│   │   ├── cors.ts           # CORS configuration
│   │   └── headers.ts        # Security headers
│   └── validations.ts        # Zod schemas
├── middleware.ts              # Security middleware
└── next.config.ts            # Security config
```

## Content Security Policy

### lib/security/csp.ts
```typescript
import { cookies } from 'next/headers'

export function generateCSP(): string {
  const nonce = cookies().get('csp-nonce')?.value || ''

  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https: blob:`,
    `font-src 'self'`,
    `connect-src 'self' https://*.vercel.app https://*.upstash.io wss:`,
    `media-src 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ]

  return directives.join('; ')
}

export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}
```

### Security Headers Configuration
```typescript
// next.config.ts
import type { NextConfig } from 'next'
import { generateCSP, generateNonce } from '@/lib/security/csp'

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: generateCSP(),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
```

### Middleware with Nonce
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Generate and set CSP nonce
  const nonce = crypto.randomUUID()
  response.cookies.set('csp-nonce', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## Rate Limiting

### lib/security/rate-limit.ts
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

// Different rate limits for different endpoints
export const rateLimiters = {
  // General API: 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
  }),

  // Auth endpoints: 5 requests per minute
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
  }),

  // Search: 30 requests per minute
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
  }),

  // Predictions: 10 per minute
  predictions: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
  }),
}

export async function rateLimit(
  identifier: string,
  limiter: keyof typeof rateLimiters = 'api'
) {
  const result = await rateLimiters[limiter].limit(identifier)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}
```

### Rate Limiting Middleware
```typescript
// middleware.ts (extended)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/security/rate-limit'

export async function middleware(request: NextRequest) {
  // Rate limiting by IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  // Different limits based on path
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const rateLimitResponse = await rateLimit(ip, 'auth')
    if (rateLimitResponse) return rateLimitResponse
  } else if (request.nextUrl.pathname.startsWith('/api/search')) {
    const rateLimitResponse = await rateLimit(ip, 'search')
    if (rateLimitResponse) return rateLimitResponse
  } else if (request.nextUrl.pathname.startsWith('/api/predictions')) {
    const rateLimitResponse = await rateLimit(ip, 'predictions')
    if (rateLimitResponse) return rateLimitResponse
  } else if (request.nextUrl.pathname.startsWith('/api')) {
    const rateLimitResponse = await rateLimit(ip, 'api')
    if (rateLimitResponse) return rateLimitResponse
  }

  // Add security headers
  const response = NextResponse.next()
  
  // CSRF protection
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')

    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403 }
      )
    }
  }

  return response
}
```

## Input Sanitization

### lib/security/sanitize.ts
```typescript
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

// Sanitize HTML content
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}

// Sanitize plain text
export function sanitizeText(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// SQL injection prevention (Prisma handles this, but for extra safety)
export function sanitizeSqlInput(input: string): string {
  return input.replace(/['";\\]/g, '')
}

// File upload validation
export function validateFileUpload(
  file: File,
  options: {
    maxSize: number
    allowedTypes: string[]
  }
): { valid: boolean; error?: string } {
  if (file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${options.maxSize / 1024 / 1024}MB limit`,
    }
  }

  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    }
  }

  return { valid: true }
}

// Zod schema with sanitization
export const sanitizedString = (min: number = 1, max: number = 1000) =>
  z
    .string()
    .min(min)
    .max(max)
    .transform((val) => sanitizeText(val.trim()))

export const sanitizedHtml = z
  .string()
  .transform((val) => sanitizeHtml(val))
```

## CORS Configuration

### lib/security/cors.ts
```typescript
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || 'https://sportsphere.ai',
  'http://localhost:3000',
]

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'X-CSRF-Token',
]

export function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin') || ''

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
    'Access-Control-Allow-Headers': ALLOWED_HEADERS.join(', '),
    'Access-Control-Max-Age': '86400',
  }

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return headers
}

export function handleCors(request: NextRequest): NextResponse | null {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(request),
    })
  }

  return null
}
```

## Password Security

### lib/security/password.ts
```typescript
import { hash, compare } from 'bcryptjs'
import { z } from 'zod'

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

// Strong password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

// Check for compromised passwords (HaveIBeenPwned API)
export async function isPasswordCompromised(password: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${password.slice(0, 5).toUpperCase()}`
    )
    const text = await response.text()
    const hash = password.toUpperCase()
    return text.includes(hash.slice(5))
  } catch {
    return false
  }
}
```

## Session Security

### lib/security/session.ts
```typescript
import { auth } from '@/lib/auth'

export async function validateSession() {
  const session = await auth()

  if (!session?.user) {
    return { valid: false, error: 'Not authenticated' }
  }

  // Check session age
  const sessionAge = Date.now() - (session.expires ? new Date(session.expires).getTime() : 0)
  const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days

  if (sessionAge > maxAge) {
    return { valid: false, error: 'Session expired' }
  }

  return { valid: true, user: session.user }
}

// Secure cookie configuration
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

## API Security Middleware

```typescript
// lib/security/api-middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from './session'
import { rateLimit } from './rate-limit'
import { handleCors, corsHeaders } from './cors'

export async function securityMiddleware(
  request: NextRequest,
  options: {
    requireAuth?: boolean
    requiredRole?: string
    rateLimiter?: string
  } = {}
) {
  // CORS check
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  // Rate limiting
  if (options.rateLimiter) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResponse = await rateLimit(ip, options.rateLimiter as any)
    if (rateLimitResponse) return rateLimitResponse
  }

  // Authentication check
  if (options.requireAuth) {
    const session = await validateSession()
    if (!session.valid) {
      return NextResponse.json(
        { error: session.error },
        { status: 401 }
      )
    }

    // Role check
    if (options.requiredRole && session.user.role !== options.requiredRole) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
  }

  // Add security headers to response
  const response = NextResponse.next()
  const headers = corsHeaders(request)
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}
```

## Common Pitfalls
1. **Missing CORS Headers** - API requests blocked by browser
2. **No Rate Limiting** - DDoS and brute force attacks
3. **Weak Passwords** - Account compromise
4. **XSS Vulnerabilities** - Script injection
5. **CSRF Attacks** - Unauthorized actions

## Best Practices
- Always validate and sanitize input
- Use CSP headers
- Implement rate limiting on all endpoints
- Use HTTPS everywhere
- Set secure, httpOnly cookies
- Validate file uploads
- Log security events
- Regular security audits
- Keep dependencies updated
- Use environment variables for secrets
