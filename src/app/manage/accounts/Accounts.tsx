"use client";

import { Plus, Star, Trash2 } from "lucide-react";
import { Account as AccountType } from "@prisma/client/edge";
import { useState } from "react";
import { signIn } from "next-auth/react";
import clsx from "clsx";
import { deleteAccount, updatePrimaryAccount } from "./actions";
import Image from "next/image";

interface DetailedAccount extends AccountType {
  name: string;
  imageUrl: string;
}

interface AccountsPageProps {
  accounts: DetailedAccount[];
}

export default function Accounts({
  accounts: initialAccounts,
}: AccountsPageProps) {
  const origPrimaryAccount =
    initialAccounts.find((account) => account.isPrimary) || null;

  const [primaryAccount, setPrimaryAccount] = useState<DetailedAccount | null>(
    origPrimaryAccount,
  );
  const [accounts, setAccounts] = useState<DetailedAccount[]>(initialAccounts);

  const handleSetPrimary = async (account: DetailedAccount) => {
    const updatePrimary = await updatePrimaryAccount(account.id);
    if (updatePrimary) setPrimaryAccount(account);
  };

  const handleDeleteAccount = async (account: DetailedAccount) => {
    const deleteAcc = await deleteAccount(account.id);
    if (deleteAcc)
      setAccounts((prevAccounts) =>
        prevAccounts.filter((accountEntry) => accountEntry.id !== account.id),
      );
  };

  return (
    <section className="w-full space-y-2">
      {accounts.map((account) => {
        const handleSetPrimaryWithAcc = handleSetPrimary.bind(null, account);
        const handleDeleteAccountWithAcc = handleDeleteAccount.bind(
          null,
          account,
        );

        return (
          <div role="alert" className="alert shadow" key={account.id}>
            <Image
              src={account.imageUrl}
              alt="Roblox Profile Picture"
              width={75}
              height={75}
              className="rounded-box size-16"
            />
            <span className="text-lg">{account.name}</span>
            <form action={handleSetPrimaryWithAcc}>
              <button
                className="btn btn-square btn-neutral"
                disabled={account.id == primaryAccount?.id}
              >
                <Star
                  className={clsx(
                    "size-5",
                    account.id == primaryAccount?.id && "fill-white",
                  )}
                />
              </button>
            </form>
            <form action={handleDeleteAccountWithAcc}>
              <button className="btn btn-square btn-neutral">
                <Trash2 className="size-5" color="#ef4444" />
              </button>
            </form>
          </div>
        );
      })}
      <button
        onClick={() => signIn("roblox")}
        className="btn w-full rounded-box shadow"
      >
        <Plus className="size-5" />
        Add Account
      </button>
    </section>
  );
}
