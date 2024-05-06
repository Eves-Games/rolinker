import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export async function POST(request: Request) {
    const session = await auth();

    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { priceId } = await request.json();

        const stripeSession = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            subscription_data: {
                metadata: {
                    discord_id: session.user.id
                }
            },
            mode: 'subscription',
            return_url: `${request.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`
        });

        return NextResponse.json({
            data: {
              id: stripeSession.id,
              client_secret: stripeSession.client_secret,
            },
            message: "Checkout session created successfully",
          });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    };
};