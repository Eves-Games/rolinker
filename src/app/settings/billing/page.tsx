import { auth } from "@/auth";
import Card from "@/components/Card";
import db from "@/db";
import { CircleSlash, Code2, Coins } from "lucide-react";
import { Metadata } from "next";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Account Billing",
};

export default async function Page() {
  const session = await auth();

  if (!session || !session.user)
    throw new Error("Could not get session! Try signing in!");

  const keyData = await db.apiKey.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <section className="w-full space-y-2">
      <Card>
        <h2 className="card-title">
          <Coins className="size-6" />
          Active Subscriptions
        </h2>
      </Card>
      {keyData?.premium ? (
        <Card>
          <h2 className="card-title">
            <Code2 className="size-6" />
            API Premium Plan
            <span className="badge badge-neutral badge-lg">$2.99/m</span>
          </h2>
          <div className="card-actions justify-end">
            <label htmlFor="free_plan_modal" className="btn btn-neutral">
              Cancel Subscription
            </label>
          </div>
        </Card>
      ) : (
        <Card>
          <h2 className="card-title">
            <CircleSlash className="size-6" />
            None Found
          </h2>
        </Card>
      )}
    </section>
  );
}
