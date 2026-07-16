import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get("sport");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};

    if (sport) {
      where.sport = { slug: sport };
    }

    const teams = await prisma.team.findMany({
      where,
      include: {
        sport: true,
        _count: {
          select: {
            players: true,
          },
        },
      },
      orderBy: { name: "asc" },
      take: limit,
    });

    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sportId, name, shortName, slug, logo, country, city } = body;

    // Validate required fields
    if (!sportId || !name || !slug) {
      return NextResponse.json(
        { error: "sportId, name, and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTeam = await prisma.team.findFirst({
      where: { slug, sportId },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: "Team with this slug already exists" },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        sportId,
        name,
        shortName,
        slug,
        logo,
        country,
        city,
      },
      include: {
        sport: true,
      },
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
