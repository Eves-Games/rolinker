export default function Loading() {
  return (
    <section className="w-full">
      <div role="alert" className="alert shadow">
        <span className="loading loading-spinner size-6"></span>
        <span className="text-lg">Loading...</span>
      </div>
    </section>
  );
}
