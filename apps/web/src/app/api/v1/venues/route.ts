import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const country = searchParams.get('country');

    const where: any = {};
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };

    const venues = await prisma.venue.findMany({
      where,
      include: {
        matches: {
          where: { status: 'SCHEDULED' },
          take: 5,
          orderBy: { scheduledAt: 'asc' },
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: venues,
      total: venues.length,
    });
  } catch (error) {
    console.error('Venues API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, city, country, capacity, pitchType } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const venue = await prisma.venue.create({
      data: {
        name,
        slug,
        city: city || null,
        country: country || null,
        capacity: capacity ? parseInt(capacity) : null,
        pitchType: pitchType || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: venue,
    }, { status: 201 });
  } catch (error) {
    console.error('Create venue error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create venue' },
      { status: 500 }
    );
  }
}
