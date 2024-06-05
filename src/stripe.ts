import Stripe from "stripe";
import { auth } from "./auth";
import db from "./db";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function cancelPremium() {
  "use server";

  const session = await auth();

  if (!session || !session.user) return;

  const subscriptions = await stripe.subscriptions.search({
    query: `status:'active' AND metadata['userId']:'${session.user.id}'`,
  });

  if (subscriptions.data.length > 0) {
    const subscription = subscriptions.data[0];
    await stripe.subscriptions.cancel(subscription.id);

    await db.apiKey.update({
      where: { userId: session.user.id },
      data: { premium: false },
    });
  }
}
