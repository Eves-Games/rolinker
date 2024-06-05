import { auth } from "@/auth";
import { EditKeyModal } from "@/components/modals/EditKeyModal";
import db from "@/db";
import {
  BarChart3,
  ChevronsUp,
  Code2,
  Equal,
  Infinity,
  Pencil,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { FreePlanModal } from "@/components/modals/FreePlanModal";
import { PremiumPlanModal } from "@/components/modals/PremiumPlanModal";
import Card from "@/components/Card";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Manage API Key",
};

export default async function Page() {
  const session = await auth();

  if (!session || !session.user)
    throw new Error("Could not get session! Try signing in!");

  const keyData =
    (await db.apiKey.findUnique({
      where: { userId: session.user.id },
    })) ??
    (await db.apiKey.create({
      data: { userId: session.user.id },
    }));

  return (
    <section className="w-full space-y-2">
      <Card>
        <h2 className="card-title">
          <Code2 className="size-6" />
          Developer API
        </h2>
        <div className="card-actions">
          <label className="form-control">
            <div className="label">
              <span className="label-text">API Key</span>
            </div>
            <label htmlFor="edit_key_modal" className="btn btn-neutral w-full">
              <Pencil className="size-5" /> Edit Key
            </label>
          </label>
        </div>
        <Link
          target="_blank"
          href="https://docs.rolinker.net"
          className="link link-primary"
        >
          Documentation{" "}
          <SquareArrowOutUpRight className="inline-block size-5" />
        </Link>
      </Card>
      <Card>
        <h2 className="card-title">
          <BarChart3 className="size-6" />
          Current Usage
          <span className="badge badge-neutral badge-lg">
            {keyData.usage}/
            {keyData.premium ? <Infinity className="size-6" /> : "750"}
          </span>
        </h2>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Premium Plan</th>
              <th>Free Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-green-500">Unlimited Requests</td>
              <td>750 Requests Daily</td>
            </tr>
            <tr>
              <td>Access all Endpoints</td>
              <td>Access all Endpoints</td>
            </tr>
            <tr>
              <td>1-on-1 Support</td>
              <td>1-on-1 Support</td>
            </tr>
          </tbody>
        </table>
        <div className="card-actions grid grid-cols-1 md:grid-cols-2">
          <label
            htmlFor="premium_plan_modal"
            className={twMerge(
              "btn btn-primary w-fit",
              keyData.premium && "btn-disabled",
            )}
            aria-disabled={keyData.premium}
            tabIndex={(keyData.premium && -1) || undefined}
          >
            <ChevronsUp className="size-5" /> Select Premium
          </label>
          <label
            htmlFor="free_plan_modal"
            className={twMerge(
              "btn btn-neutral w-fit",
              !keyData.premium && "btn-disabled",
            )}
            aria-disabled={!keyData.premium}
            tabIndex={(!keyData.premium && -1) || undefined}
          >
            <Equal className="size-5" /> Select Free
          </label>
        </div>
      </Card>

      <EditKeyModal keyData={keyData} />
      <PremiumPlanModal />
    </section>
  );
}
