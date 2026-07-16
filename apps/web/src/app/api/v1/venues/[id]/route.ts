import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            homeTeam: { include: { sport: true } },
            awayTeam: { include: { sport: true } },
          },
          orderBy: { scheduledAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!venue) {
      return NextResponse.json(
        { success: false, error: 'Venue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: venue });
  } catch (error) {
    console.error('Venue detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch venue' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, city, country, capacity, pitchType } = body;

    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(city && { city }),
        ...(country && { country }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(pitchType && { pitchType }),
      },
    });

    return NextResponse.json({ success: true, data: venue });
  } catch (error) {
    console.error('Update venue error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update venue' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.venue.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Venue deleted' });
  } catch (error) {
    console.error('Delete venue error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete venue' },
      { status: 500 }
    );
  }
}
