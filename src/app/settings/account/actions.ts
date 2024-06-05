"use server";

import { auth } from "@/auth";
import db from "@/db";

export async function deleteAccount(): Promise<boolean> {
  const session = await auth();

  if (!session || !session.user) return false;

  const userId = session.user.id;

  try {
    //await db.$transaction([
    //    db.apiKey.deleteMany({ where: { userId } }),
    //    db.accountGuild.deleteMany({ where: { userId } }),
    //    db.account.deleteMany({ where: { userId } })
    //]);
    console.log("deleted");
    return true;
  } catch {
    return false;
  }
}
