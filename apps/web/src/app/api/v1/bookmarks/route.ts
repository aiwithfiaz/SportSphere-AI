import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        article: {
          select: {
            id: true, title: true, slug: true, excerpt: true, publishedAt: true,
            categories: { select: { name: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: bookmarks });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, articleId } = await request.json();

    if (!userId || !articleId) {
      return NextResponse.json({ success: false, error: 'userId and articleId required' }, { status: 400 });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, data: { bookmarked: false } });
    }

    await prisma.bookmark.create({ data: { userId, articleId } });
    return NextResponse.json({ success: true, data: { bookmarked: true } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
