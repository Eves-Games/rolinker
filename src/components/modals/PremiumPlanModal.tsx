"use client";

import { loadStripe } from "@stripe/stripe-js";
import useSWR from "swr";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priceId: "price_1P1i0ADju7hY58JXekQ3iDre" }),
  });
  const resData = await res.json();
  return resData.data.client_secret;
};

export function PremiumPlanModal() {
  const { data: clientSecret, error } = useSWR(
    "/api/payments/embedded-checkout",
    fetcher,
  );

  if (error) throw new Error("Could not get checkout!");

  const options = { clientSecret: clientSecret };

  return (
    <>
      <input type="checkbox" id="premium_plan_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box bg-base-200">
          <h3 className="text-xl font-bold">Buy Premium</h3>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
          <div className="modal-action">
            <label htmlFor="premium_plan_modal" className="btn btn-neutral">
              Cancel
            </label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="premium_plan_modal" />
      </div>
    </>
  );
}
