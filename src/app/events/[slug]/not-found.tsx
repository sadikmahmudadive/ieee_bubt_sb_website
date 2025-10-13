import Link from "next/link";

export default function EventNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center text-slate-100">
      <span className="rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">
        Event Unavailable
      </span>
      <h1 className="heading-font text-3xl font-semibold text-white">We couldn&apos;t find that event.</h1>
      <p className="max-w-xl text-sm text-slate-300">
        The event you&apos;re looking for may have been archived or the link might be incorrect. Explore other IEEE BUBT SB
        programs to stay up to date with our upcoming experiences.
      </p>
      <Link
        href="/#events"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-light transition hover:text-white"
      >
        Browse Events →
      </Link>
    </div>
  );
}
