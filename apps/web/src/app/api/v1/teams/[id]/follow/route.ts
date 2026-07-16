import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teamId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    const existing = await prisma.teamFollow.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });

    if (existing) {
      await prisma.teamFollow.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, data: { following: false } });
    }

    await prisma.teamFollow.create({ data: { userId, teamId } });
    return NextResponse.json({ success: true, data: { following: true } }, { status: 201 });
  } catch (error) {
    console.error('Follow team error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teamId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const followerCount = await prisma.teamFollow.count({ where: { teamId } });

    if (userId) {
      const isFollowing = await prisma.teamFollow.findUnique({
        where: { userId_teamId: { userId, teamId } },
      });
      return NextResponse.json({ success: true, data: { followerCount, following: !!isFollowing } });
    }

    return NextResponse.json({ success: true, data: { followerCount, following: false } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
