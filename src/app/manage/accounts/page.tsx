import { auth } from "@/auth";
import { Metadata } from "next";
import Accounts from "./Accounts";
import { getDetailedAccounts } from "@/roblox";

export const metadata: Metadata = {
  title: "Manage Accounts",
};

export default async function Page() {
  const session = await auth();

  if (!session || !session.user)
    throw new Error("Could not get session! Try signing in!");

  const detailedAccounts = await getDetailedAccounts(session?.user.id);
  if (!detailedAccounts) throw new Error("Could not get accounts!");

  detailedAccounts.sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) {
      return -1;
    } else if (!a.isPrimary && b.isPrimary) {
      return 1;
    } else {
      return 0;
    }
  });

  return <Accounts accounts={detailedAccounts} />
}
