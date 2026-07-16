# UI Designer Skill

## Description
Design and implement beautiful, responsive user interfaces using Shadcn UI, Tailwind CSS 4, and Framer Motion for SportSphere AI.

## When to Use
- Creating new UI components
- Styling pages and layouts
- Adding animations and transitions
- Implementing responsive designs
- Creating loading states and skeletons
- Designing forms and interactive elements

## Tech Stack
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn UI
- **Animation**: Framer Motion 11+
- **Icons**: Lucide React
- **Typography**: Inter + Geist fonts

## File Structure
```
src/
├── components/
│   ├── ui/                    # Shadcn components (don't modify directly)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── layout/                # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── mobile-nav.tsx
│   ├── features/              # Feature components
│   │   ├── team-card.tsx
│   │   ├── match-card.tsx
│   │   ├── player-card.tsx
│   │   ├── news-card.tsx
│   │   └── prediction-form.tsx
│   └── shared/                # Shared components
│       ├── search-bar.tsx
│       ├── pagination.tsx
│       └── empty-state.tsx
├── styles/
│   └── globals.css            # Tailwind config + custom styles
└── lib/
    └── utils.ts               # cn() utility
```

## Shadcn Component Patterns

### Button Component
```tsx
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function SubmitButton({ isLoading, children }) {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
```

### Card Components
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TeamCard({ team }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <img
          src={team.logo || '/placeholder-team.png'}
          alt={team.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <CardTitle className="text-xl">{team.name}</CardTitle>
          <CardDescription>{team.league}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Badge variant="secondary">{team.country}</Badge>
          <Badge variant="outline">{team.players?.length} Players</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Form Components with React Hook Form + Zod
```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Your message..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Send Message
        </Button>
      </form>
    </Form>
  )
}
```

## Tailwind CSS Patterns

### Global Styles (globals.css)
```css
@import "tailwindcss";

@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0.042 265.755);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.97 0 0);
  --color-secondary-foreground: oklch(0.205 0 0);
  --color-muted: oklch(0.97 0 0);
  --color-muted-foreground: oklch(0.556 0 0);
  --color-accent: oklch(0.97 0 0);
  --color-accent-foreground: oklch(0.205 0 0);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-border: oklch(0.922 0 0);
  --color-input: oklch(0.922 0 0);
  --color-ring: oklch(0.708 0 0);
  --radius: 0.625rem;

  /* Dark mode */
  --color-background-dark: oklch(0.145 0 0);
  --color-foreground-dark: oklch(0.985 0 0);
}

@layer base {
  :root {
    background: var(--color-background);
    color: var(--color-foreground);
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Responsive Patterns
```tsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {items.map((item) => (
    <Card key={item.id}>
      <CardContent className="p-4">
        {/* Mobile: full width, Tablet: half, Desktop: quarter */}
      </CardContent>
    </Card>
  ))}
</div>

// Responsive typography
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only content</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile only content</div>
```

### Custom Component Patterns
```tsx
// Stat card component
export function StatCard({ label, value, change, icon: Icon }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}% from last month
              </p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Framer Motion Patterns

### Page Transitions
```tsx
'use client'

import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### Staggered List Animation
```tsx
'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function AnimatedList({ items }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {items.map((item) => (
        <motion.li key={item.id} variants={item}>
          <Card>{item.name}</Card>
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

### Hover Effects
```tsx
'use client'

import { motion } from 'framer-motion'

export function HoverCard({ children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  )
}
```

### Loading Animations
```tsx
'use client'

import { motion } from 'framer-motion'

export function PulseLoader() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-primary rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
```

## Skeleton Loading States
```tsx
import { Skeleton } from '@/components/ui/skeleton'

export function TeamCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}
```

## Common Pitfalls
1. **Overusing 'use client'** - Keep components as Server Components when possible
2. **Hydration Issues** - Avoid browser-only APIs in server components
3. **Bundle Size** - Import only what you need from libraries
4. **Accessibility** - Use semantic HTML and proper ARIA attributes
5. **Mobile First** - Design for mobile, then enhance for desktop

## Best Practices
- Use Shadcn UI components as building blocks
- Create reusable feature components
- Implement proper loading states
- Use Framer Motion for meaningful animations
- Follow consistent spacing and typography
- Ensure color contrast for accessibility
- Test on multiple screen sizes
