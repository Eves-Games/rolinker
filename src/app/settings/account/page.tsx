import { auth } from "@/auth";
import Card from "@/components/Card";
import { DeleteAccountModal } from "@/components/modals/DeleteAccountModal";
import db from "@/db";
import clsx from "clsx";
import { FileBarChart, SquareArrowOutUpRight, Trash } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Account Settings",
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
          <FileBarChart className="size-6" />
          Your Data
        </h2>
        <div className="card-actions">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Delete Data</span>
            </div>
            <div
              className="tooltip tooltip-bottom"
              data-tip="Cancel all subscriptions first!"
            >
              <label
                htmlFor="delete_account_modal"
                className={clsx(
                  "btn btn-neutral",
                  keyData && keyData.premium && "btn-disabled",
                )}
              >
                <Trash className="size-5" />
                Delete Account
              </label>
            </div>
          </label>
        </div>
        <Link
          target="_blank"
          href="/privacy-policy"
          className="link link-primary"
        >
          Privacy Policy
          <SquareArrowOutUpRight className="inline-block size-5" />
        </Link>
      </Card>

      <DeleteAccountModal />
    </section>
  );
}
