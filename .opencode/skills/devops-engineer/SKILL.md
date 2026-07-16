# DevOps Engineer Skill

## Description
Set up CI/CD pipelines, Docker containers, and deployment workflows for SportSphere AI.

## When to Use
- Setting up GitHub Actions workflows
- Creating Docker configurations
- Deploying to Vercel/AWS/Docker
- Configuring environment variables
- Setting up monitoring and logging
- Managing database migrations

## Tech Stack
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, Docker Compose
- **Deployment**: Vercel, Docker
- **Monitoring**: Vercel Analytics, Sentry
- **Database**: PostgreSQL (Supabase/AWS RDS)

## File Structure
```
├── .github/
│   └── workflows/
│       ├── ci.yml              # Continuous Integration
│       ├── cd-preview.yml      # Preview Deployments
│       └── cd-production.yml   # Production Deployments
├── docker/
│   ├── Dockerfile              # Multi-stage build
│   ├── docker-compose.yml      # Local development
│   └── docker-compose.prod.yml # Production
├── scripts/
│   ├── setup.sh                # Setup script
│   ├── seed.sh                 # Database seeding
│   └── migrate.sh              # Migration script
├── .env.example                # Environment template
├── .env.local                  # Local environment
└── vercel.json                 # Vercel configuration
```

## Docker Configuration

### docker/Dockerfile
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### docker/docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: sportsphere
      POSTGRES_PASSWORD: password
      POSTGRES_DB: sportsphere_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U sportsphere']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://sportsphere:password@db:5432/sportsphere_dev
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=your-secret-here
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
```

## GitHub Actions CI/CD

### .github/workflows/ci.yml
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run ESLint
        run: yarn lint

      - name: Run TypeScript check
        run: yarn typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: lint

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://test:test@localhost:5432/test
      NEXTAUTH_SECRET: test-secret
      NEXTAUTH_URL: http://localhost:3000

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run Prisma migrations
        run: npx prisma migrate deploy

      - name: Run tests
        run: yarn test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build application
        run: yarn build
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          NEXTAUTH_SECRET: test-secret

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build
          path: .next
```

### .github/workflows/cd-preview.yml
```yaml
name: Deploy Preview

on:
  pull_request:
    branches: [main]

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    environment:
      name: preview
      url: ${{ steps.deploy.outputs.url }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployed: ${process.env.DEPLOY_URL}`
            })
```

### .github/workflows/cd-production.yml
```yaml
name: Deploy Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://sportsphere.ai

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Production
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Notify deployment
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "✅ Production deployed successfully"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Vercel Configuration

### vercel.json
```json
{
  "buildCommand": "yarn build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "crons": [
    {
      "path": "/api/cron/revalidate",
      "schedule": "0 * * * *"
    }
  ],
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ]
}
```

## Environment Variables

### .env.example
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sportsphere"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_URL=""
UPSTASH_REDIS_TOKEN=""

# Sentry (Error tracking)
SENTRY_DSN=""

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Deployment Scripts

### scripts/setup.sh
```bash
#!/bin/bash

echo "🚀 Setting up SportSphere AI..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker."
  exit 1
fi

# Copy environment file
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from .env.example..."
  cp .env.example .env.local
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose -f docker/docker-compose.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 5

# Run Prisma migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Seed database
echo "🌱 Seeding database..."
npx prisma db seed

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

echo "✅ Setup complete! Run 'yarn dev' to start development."
```

### scripts/deploy.sh
```bash
#!/bin/bash

echo "🚀 Deploying to production..."

# Run tests
echo "🧪 Running tests..."
yarn test

# Build application
echo "📦 Building application..."
yarn build

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "📥 Installing Vercel CLI..."
  npm install -g vercel
fi

# Deploy to production
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
```

## Database Migration Scripts

### scripts/migrate.sh
```bash
#!/bin/bash

echo "🔄 Running database migrations..."

case "$1" in
  "dev")
    npx prisma migrate dev
    ;;
  "deploy")
    npx prisma migrate deploy
    ;;
  "reset")
    echo "⚠️  This will reset the database. Are you sure? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
      npx prisma migrate reset
    fi
    ;;
  *)
    echo "Usage: ./migrate.sh [dev|deploy|reset]"
    ;;
esac
```

## Monitoring Setup

### Sentry Configuration
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
  ],
})
```

## Common Pitfalls
1. **Missing Environment Variables** - Application fails to start
2. **Database Migration Failures** - Schema mismatch
3. **Build Failures** - Missing dependencies
4. **Docker Issues** - Port conflicts
5. **CI/CD Failures** - Secret not configured

## Best Practices
- Use multi-stage Docker builds
- Implement proper CI/CD pipelines
- Use environment-specific configurations
- Monitor deployments with Sentry
- Use preview deployments for PRs
- Automate database migrations
- Use secrets management
- Implement rollback strategies
