import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import db from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature') || '';

        const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
        if (!event) return NextResponse.json({ message: "Event cannot be verified" }, { status: 401 });

        const { type, data } = event;
        if (type !== "customer.subscription.created" && type !== "customer.subscription.deleted") return NextResponse.json({ message: "Invalid event" }, { status: 400 });

        const { userId } = data.object.metadata;
        const premium = type === "customer.subscription.created";

        await db.apiKey.update({
            where: { userId },
            data: { premium },
        });

        return NextResponse.json({ message: "Webhook handled successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};