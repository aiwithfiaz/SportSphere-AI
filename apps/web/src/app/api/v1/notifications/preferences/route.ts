import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = 'cmrmxwjam0014tmjcwvpxu554'; // Default user for now

    const preferences = await prisma.notificationPreference.findMany({
      where: { userId },
    });

    return NextResponse.json({ success: true, data: preferences });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { preferences } = await request.json();
    const userId = 'cmrmxwjam0014tmjcwvpxu554'; // Default user for now

    for (const pref of preferences) {
      await prisma.notificationPreference.upsert({
        where: { userId_type: { userId, type: pref.type } },
        create: {
          userId,
          type: pref.type,
          isEnabled: pref.isEnabled,
          emailEnabled: pref.emailEnabled,
          pushEnabled: pref.pushEnabled,
        },
        update: {
          isEnabled: pref.isEnabled,
          emailEnabled: pref.emailEnabled,
          pushEnabled: pref.pushEnabled,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Preferences updated" });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
