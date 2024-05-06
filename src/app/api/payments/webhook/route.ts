import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import db from "@/lib/db";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature") || "";

    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    if (!event) return NextResponse.json({ message: "Event cannot be verified" }, { status: 401 });

    const { type, data } = event;

    if (type !== "customer.subscription.created" && type !== "customer.subscription.deleted") return NextResponse.json({ message: "Invalid event" }, { status: 400 });

    const { discord_id: discordId } = data.object.metadata;
    const isPremium = type === "customer.subscription.created";

    await db.apiKey.update({
      where: { userId: discordId },
      data: { premium: isPremium },
    });

    return NextResponse.json({ message: "Webhook handled successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};