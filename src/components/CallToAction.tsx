export function CallToAction() {
  return (
    <section id="join" className="relative isolate overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/60 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-72 -skew-y-6 bg-gradient-to-r from-primary via-primary-light to-accent opacity-50 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-4xl rounded-[3rem] border border-white/15 bg-slate-950/75 p-12 text-center shadow-[0_40px_80px_-40px_rgba(15,23,42,0.9)] backdrop-blur">
        <h2 className="heading-font text-3xl font-semibold text-white sm:text-4xl">
          Join IEEE BUBT Student Branch
        </h2>
        <p className="mt-5 text-base text-slate-200">
          Collaborate with innovators across Bangladesh, access IEEE resources, and unlock mentorship that accelerates your
          impact.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://ieee.org"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary transition hover:bg-slate-100"
          >
            Apply for Membership
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/10"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </section>
  );
}
