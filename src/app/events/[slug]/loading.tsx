export default function LoadingEventPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-24">
      <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
      <div className="mt-6 h-80 animate-pulse rounded-3xl bg-white/5 sm:h-[420px]" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
          <div className="h-4 w-1/3 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
