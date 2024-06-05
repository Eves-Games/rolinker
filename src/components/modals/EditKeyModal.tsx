"use client";

import { regenerateApiKey } from "@/app/manage/api-key/actions";
import { ApiKey } from "@prisma/client/edge";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

export function EditKeyModal({ keyData }: { keyData: ApiKey }) {
  const [apiKey, setApiKey] = useState(keyData.key);

  const handleRegenerateApiKey = async () => {
    const newApiKey = await regenerateApiKey(keyData.userId);
    if (newApiKey) setApiKey(newApiKey);
  };

  return (
    <>
      <input type="checkbox" id="edit_key_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box space-y-4 bg-base-200">
          <h3 className="text-xl font-bold">Edit Key</h3>
          <span className="badge badge-neutral badge-lg">{apiKey}</span>
          <p>Do not share your API key publicly. Keep it secure.</p>
          <div className="modal-action">
            <form action={handleRegenerateApiKey}>
              <button className="btn btn-neutral">
                <RefreshCcw className="size-5" /> Reset Key
              </button>
            </form>

            <label htmlFor="edit_key_modal" className="btn btn-neutral">
              Cancel
            </label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="edit_key_modal" />
      </div>
    </>
  );
}
