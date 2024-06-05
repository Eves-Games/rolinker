"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="prose max-w-none text-center"> 
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
    </div>
  );
}
