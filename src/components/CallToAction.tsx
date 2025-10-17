export function CallToAction() {
  return (
    <section id="join" className="relative isolate py-24">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/5 via-transparent to-transparent" aria-hidden />
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-slate-200/70 bg-white p-12 text-center shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)]">
        <div className="relative space-y-6">
          <h2 className="heading-font text-[2rem] font-semibold text-slate-900">Join IEEE BUBT Student Branch</h2>
          <p className="text-base text-slate-600">
            Collaborate with innovators across Bangladesh, access IEEE resources, and unlock mentorship that accelerates your impact.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <a
              href="/apply"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-slate-800"
            >
              Apply for Membership
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-900/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-slate-900 transition hover:border-primary hover:text-primary"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
