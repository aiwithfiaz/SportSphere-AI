import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: { sport: true, _count: { select: { matches: true, standings: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ success: true, data: tournaments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, sportId, startDate, endDate } = await request.json();
    if (!name || !sportId) return NextResponse.json({ success: false, error: 'name and sportId required' }, { status: 400 });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tournament = await prisma.tournament.create({
      data: {
        name,
        slug,
        sportId,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });
    return NextResponse.json({ success: true, data: tournament }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
