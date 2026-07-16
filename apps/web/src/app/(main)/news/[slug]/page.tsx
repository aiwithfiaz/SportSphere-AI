import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Eye, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CommentsSection } from './CommentsSection';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, content: true },
  });

  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.title,
    description: article.excerpt || article.content.slice(0, 160),
    openGraph: { title: article.title, description: article.excerpt || '' },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, displayName: true, email: true } },
      categories: true,
      comments: {
        include: {
          user: { select: { id: true, displayName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { comments: true } },
    },
  });

  if (!article) notFound();

  // Increment view count
  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  const relatedArticles = await prisma.article.findMany({
    where: {
      id: { not: article.id },
      status: 'PUBLISHED',
      ...(article.sportId && { sportId: article.sportId }),
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      categories: { select: { name: true }, take: 1 },
    },
  });

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/news" className="hover:text-foreground">News</Link>
        <span>/</span>
        <span className="text-foreground">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        {article.categories.length > 0 && (
          <div className="mb-3 flex gap-2">
            {article.categories.map((cat) => (
              <Badge key={cat.id}>{cat.name}</Badge>
            ))}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-lg text-muted-foreground mb-4">{article.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {article.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.author.displayName || article.author.email}
            </div>
          )}
          {article.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {article.viewCount} views
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {article._count.comments} comments
          </div>
        </div>
      </header>

      {/* Article Body */}
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag, idx) => (
            <Badge key={idx} variant="outline">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Share */}
      <div className="flex items-center gap-3 mb-8 p-4 bg-muted rounded-lg">
        <Share2 className="h-5 w-5" />
        <span className="text-sm font-medium">Share this article</span>
        <div className="flex gap-2 ml-auto">
          <Button size="sm" variant="outline">Twitter</Button>
          <Button size="sm" variant="outline">Facebook</Button>
          <Button size="sm" variant="outline">LinkedIn</Button>
        </div>
      </div>

      {/* Comments */}
      <CommentsSection
        articleId={article.id}
        initialComments={article.comments}
        commentCount={article._count.comments}
      />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/news/${related.slug}`}
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold line-clamp-2 mb-2">{related.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{related.excerpt}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  {related.categories.length > 0 && <Badge variant="secondary">{related.categories[0].name}</Badge>}
                  {related.publishedAt && (
                    <span>{new Date(related.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Button({ children, ...props }: any) {
  return <button {...props}>{children}</button>;
}
