import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Link from "next/link";

async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId!);
  return session;
}

export default async function CheckoutReturn({ searchParams }: { searchParams: { session_id: string } }) {
  const sessionId = searchParams.session_id;
  const session = await getSession(sessionId);

  console.log(session)

  if (session?.status === "open") {
    return (
      <div className='text-center my-4'>
        <h1 className='font-bold text-3xl'>Payment failed!</h1>
        <p>Try again or contact <Link className='text-blue-500 hover:underline' href='https://discord.gg/yV2sSRJ9h5'>support</Link>.</p>
      </div>
    )
  }

  if (session?.status === "complete") {
    return (
      <div className='text-center my-4'>
        <h1 className='font-bold text-3xl'>Payment success!</h1>
        <p>Thank-you for your business.</p>
      </div>
    )
  }

  return null;
}