import { Reveal } from "@/components/Reveal";

export function CallToAction() {
  return (
    <section id="join" className="relative isolate py-20 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-surface/50 via-transparent to-transparent" aria-hidden />
      <div className="mx-auto max-w-4xl px-6">
        <Reveal y={40} duration={0.8}>
          <div className="relative overflow-hidden rounded-[5px] border border-border bg-white p-10 text-center shadow-[0_2px_4px_rgba(0,0,0,0.08)] sm:p-12">
            <div className="relative space-y-6">
              <h2 className="heading-font text-[2rem] font-light text-slate-900">Join IEEE BUBT Student Branch</h2>
              <p className="text-base text-slate-600">
                Collaborate with innovators across Bangladesh, access IEEE resources, and unlock mentorship that accelerates your impact.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
                <a
                  href="/apply"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-primary-dark"
                >
                  Apply for Membership
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-primary transition hover:bg-surface hover:text-primary-dark"
                >
                  Contact Our Team
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
