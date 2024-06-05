"use server";

import { auth } from "@/auth";
import db from "@/db";

export async function updatePrimaryAccount(
  accountId: string,
): Promise<boolean> {
  console.log("sent away");
  const session = await auth();

  if (!session?.user) return false;

  try {
    await db.$transaction([
      db.account.update({
        where: {
          onePrimaryAccountPerUser: {
            userId: session.user.id,
            isPrimary: true,
          },
        },
        data: {
          isPrimary: false,
        },
      }),
      db.account.update({
        where: {
          id: accountId,
          userId: session.user.id,
        },
        data: {
          isPrimary: true,
        },
      }),
    ]);
  } catch {
    return false;
  }

  return true;
}

export async function deleteAccount(accountId: string): Promise<boolean> {
  const session = await auth();

  if (!session?.user) return false;

  try {
    await db.account.delete({
      where: {
        id: accountId,
        userId: session.user.id,
      },
    });
  } catch {
    return false;
  }

  return true;
}