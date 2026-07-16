export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get("sport");
    const tournament = searchParams.get("tournament");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};

    if (sport) {
      where.sport = { slug: sport };
    }

    if (tournament) {
      where.tournament = { slug: tournament };
    }

    const standings = await prisma.standing.findMany({
      where,
      include: {
        tournament: {
          include: { sport: true },
        },
        team: true,
      },
      orderBy: { position: "asc" },
      take: limit,
    });

    return NextResponse.json({ success: true, data: standings });
  } catch (error) {
    console.error("Error fetching standings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
