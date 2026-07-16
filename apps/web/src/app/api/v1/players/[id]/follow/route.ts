import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playerId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    const existing = await prisma.playerFollow.findUnique({
      where: { userId_playerId: { userId, playerId } },
    });

    if (existing) {
      await prisma.playerFollow.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, data: { following: false } });
    }

    await prisma.playerFollow.create({ data: { userId, playerId } });
    return NextResponse.json({ success: true, data: { following: true } }, { status: 201 });
  } catch (error) {
    console.error('Follow player error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playerId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const followerCount = await prisma.playerFollow.count({ where: { playerId } });

    if (userId) {
      const isFollowing = await prisma.playerFollow.findUnique({
        where: { userId_playerId: { userId, playerId } },
      });
      return NextResponse.json({ success: true, data: { followerCount, following: !!isFollowing } });
    }

    return NextResponse.json({ success: true, data: { followerCount, following: false } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
