"use client";

import { deleteAccount } from "@/app/settings/account/actions";
import { Check } from "lucide-react";
import { signOut } from "next-auth/react";

export function DeleteAccountModal() {
  const handleDeleteAccount = async () => {
    const delAcc = await deleteAccount();
    if (delAcc) signOut({redirect: true, callbackUrl: "/"});
  };

  return (
    <>
      <input type="checkbox" id="delete_account_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box space-y-4 bg-base-200">
          <h3 className="text-xl font-bold">Are you sure?</h3>
          <p>This will delete your RoLinker account!</p>
          <div className="modal-action">
            <form action={handleDeleteAccount}>
              <button>
                <label htmlFor="delete_account_modal" className="btn btn-primary">
                  <Check className="size-5" />
                  Confirm
                </label>
              </button>
            </form>
            <label htmlFor="delete_account_modal" className="btn btn-neutral">
              Cancel
            </label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="delete_account_modal" />
      </div>
    </>
  );
}
