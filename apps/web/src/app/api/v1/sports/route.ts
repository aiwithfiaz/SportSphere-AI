import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sports = await prisma.sport.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { teams: true, tournaments: true, matches: true } } },
    });
    return NextResponse.json({ success: true, data: sports });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, icon } = await request.json();
    if (!name) return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const sport = await prisma.sport.create({ data: { name, slug, icon: icon || null } });
    return NextResponse.json({ success: true, data: sport }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
