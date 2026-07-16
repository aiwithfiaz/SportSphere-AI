import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    const sportId = searchParams.get('sportId');
    const isActive = searchParams.get('isActive');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (matchId) where.matchId = matchId;
    if (sportId) where.sportId = sportId;
    if (isActive !== null) where.isActive = isActive === 'true';

    const predictions = await prisma.prediction.findMany({
      where,
      include: {
        sport: true,
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        userPredictions: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: predictions,
      total: predictions.length,
    });
  } catch (error) {
    console.error('Predictions API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sportId, matchId, title, description, prediction, confidence } = body;

    if (!title || !prediction) {
      return NextResponse.json(
        { success: false, error: 'title and prediction are required' },
        { status: 400 }
      );
    }

    const newPrediction = await prisma.prediction.create({
      data: {
        sportId: sportId || null,
        matchId: matchId || null,
        title,
        description: description || null,
        prediction,
        confidence: confidence ? parseFloat(confidence) : null,
      },
      include: {
        sport: true,
        match: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newPrediction,
    }, { status: 201 });
  } catch (error) {
    console.error('Create prediction error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create prediction' },
      { status: 500 }
    );
  }
}
