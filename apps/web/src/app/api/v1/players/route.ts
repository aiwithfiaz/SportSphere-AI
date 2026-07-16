import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get("sport");
    const team = searchParams.get("team");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};

    if (sport) {
      where.sport = { slug: sport };
    }

    if (team) {
      where.team = { slug: team };
    }

    const players = await prisma.player.findMany({
      where,
      include: {
        sport: true,
        team: true,
      },
      orderBy: { firstName: "asc" },
      take: limit,
    });

    return NextResponse.json({ success: true, data: players });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sportId,
      teamId,
      firstName,
      lastName,
      slug,
      avatar,
      dateOfBirth,
      nationality,
      role,
      battingStyle,
      bowlingStyle,
    } = body;

    // Validate required fields
    if (!sportId || !firstName || !lastName || !slug) {
      return NextResponse.json(
        { error: "sportId, firstName, lastName, and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPlayer = await prisma.player.findFirst({
      where: { slug, sportId },
    });

    if (existingPlayer) {
      return NextResponse.json(
        { error: "Player with this slug already exists" },
        { status: 400 }
      );
    }

    const player = await prisma.player.create({
      data: {
        sportId,
        teamId,
        firstName,
        lastName,
        slug,
        avatar,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        nationality,
        role,
        battingStyle,
        bowlingStyle,
      },
      include: {
        sport: true,
        team: true,
      },
    });

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
