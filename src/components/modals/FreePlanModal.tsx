import { cancelPremium } from "@/stripe";
import { Check } from "lucide-react";

export function FreePlanModal() {
  return (
    <>
      <input type="checkbox" id="free_plan_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box space-y-4 bg-base-200">
          <h3 className="text-xl font-bold">Are you sure?</h3>
          <p>This will end your Premium Plan!</p>
          <div className="modal-action">
            <form action={cancelPremium}>
              <button>
                <label htmlFor="free_plan_modal" className="btn btn-primary">
                  <Check className="size-5" />
                  Confirm
                </label>
              </button>
            </form>
            <label htmlFor="free_plan_modal" className="btn btn-neutral">
              Cancel
            </label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="free_plan_modal" />
      </div>
    </>
  );
}
