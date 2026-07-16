import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        start: date,
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      };
    }).reverse();

    const userGrowth = await Promise.all(
      months.map(async (m) => {
        const count = await prisma.user.count({
          where: { createdAt: { gte: m.start, lte: m.end } },
        });
        return { month: m.month, users: count };
      })
    );

    const matchStats = await prisma.sport.findMany({
      select: {
        name: true,
        matches: { select: { id: true } },
      },
    });

    const matchStatsFormatted = matchStats.map((s) => ({
      sport: s.name,
      matches: s.matches.length,
    }));

    const topTeams = await prisma.team.findMany({
      select: { name: true, _count: { select: { followedBy: true } } },
      orderBy: { followedBy: { _count: 'desc' } },
      take: 10,
    });

    const topTeamsFormatted = topTeams.map((t) => ({
      name: t.name,
      followers: t._count.followedBy,
    }));

    const revenueByPlan = await prisma.subscription.groupBy({
      by: ['plan'],
      _count: { id: true },
    });

    const revenueByPlanFormatted = revenueByPlan.map((r) => ({
      name: r.plan,
      plan: r.plan,
      revenue: r._count.id * (r.plan === 'premium' ? 19.99 : r.plan === 'pro' ? 9.99 : 0),
    }));

    return NextResponse.json({
      success: true,
      data: {
        userGrowth,
        matchStats: matchStatsFormatted,
        revenueByPlan: revenueByPlanFormatted,
        topTeams: topTeamsFormatted,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
