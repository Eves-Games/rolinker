"use client";

import { useSubmissionContext } from "@/components/contexts/SubmissionContext";
import clsx from "clsx";
import { Cookie } from "lucide-react";
import { useState } from "react";

export default function SubmitCookie() {
  const [cookieVisible, setCookieVisible] = useState(false)
  const { submission, setSubmission } = useSubmissionContext();

  const currentCookie = submission.robloxCookie;

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const selectedValue = event.target.value;
    const robloxCookie = selectedValue.length === 0 ? "" : selectedValue;

    setSubmission((prevSubmission) => ({
      ...prevSubmission,
      robloxCookie,
    }));
  };

  function toggleCookieVisibility() {
    setCookieVisible((prevVisible) => !prevVisible);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <textarea onChange={handleChange} className={clsx("textarea w-full h-24 overflow-y-hidden", !cookieVisible && "blur-sm")} placeholder={"Enter bot cookie"}>
        {currentCookie}
      </textarea>
      <button onClick={toggleCookieVisibility} className="btn btn-neutral"><Cookie className="size-5" /> {cookieVisible ? "Hide" : "View"} Cookie</button>
    </div>
  );
}
