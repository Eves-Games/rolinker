import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="card card-compact bg-base-200 shadow">
      <div className="card-body">{children}</div>
    </div>
  );
}
