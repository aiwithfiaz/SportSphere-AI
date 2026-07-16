import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ success: false, error: "Missing signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;

        if (userId) {
          const priceId = subscription.items.data[0]?.price.id;
          const planName = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro' :
                          priceId === process.env.STRIPE_PREMIUM_PRICE_ID ? 'premium' : 'free';

          await prisma.subscription.upsert({
            where: { id: subscription.id },
            create: {
              id: subscription.id,
              userId,
              plan: planName,
              status: subscription.status === 'active' ? 'active' : 'inactive',
              startDate: new Date((subscription as any).current_period_start * 1000),
              endDate: new Date((subscription as any).current_period_end * 1000),
            },
            update: {
              plan: planName,
              status: subscription.status === 'active' ? 'active' : 'inactive',
              endDate: new Date((subscription as any).current_period_end * 1000),
            },
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;

        if (userId) {
          await prisma.subscription.updateMany({
            where: { userId, id: subscription.id },
            data: { status: 'cancelled' },
          });
        }
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ success: false, error: "Webhook failed" }, { status: 500 });
  }
}
