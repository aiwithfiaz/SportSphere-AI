import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SportSphere AI - Intelligent Sports Analytics',
    template: '%s | SportSphere AI',
  },
  description:
    'AI-powered sports analytics platform providing real-time insights, predictions, and intelligent analysis for sports enthusiasts and professionals.',
  keywords: [
    'sports analytics',
    'AI sports',
    'real-time sports data',
    'sports predictions',
    'machine learning sports',
    'sports insights',
    'SportSphere',
  ],
  authors: [{ name: 'SportSphere AI Team' }],
  creator: 'SportSphere AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sportsphere.ai',
    siteName: 'SportSphere AI',
    title: 'SportSphere AI - Intelligent Sports Analytics',
    description:
      'AI-powered sports analytics platform providing real-time insights, predictions, and intelligent analysis.',
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
    title: 'SportSphere AI - Intelligent Sports Analytics',
    description:
      'AI-powered sports analytics platform providing real-time insights, predictions, and intelligent analysis.',
    images: ['/og-image.png'],
    creator: '@sportsphere_ai',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="sportsphere-theme">
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
