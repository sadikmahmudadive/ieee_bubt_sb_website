import { Reveal } from "@/components/Reveal";

export function CallToAction() {
  return (
    <section id="join" className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-navy via-primary to-cyan-soft/80" />
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,174,239,0.3) 0%, transparent 50%)"
        }}
      />
      <div className="absolute -left-20 -top-20 -z-10 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-cyan-soft/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-20 -right-20 -z-10 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <Reveal y={40} duration={0.8}>
          <div className="relative space-y-6 sm:space-y-8">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm">
                ⚡ Join the Community
              </span>
            </div>
            <h2 className="heading-font text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Shape the Future of{" "}
              <span className="text-cyan-soft">Technology</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-white/75">
              Collaborate with innovators across Bangladesh, access IEEE resources, and unlock mentorship that accelerates your impact.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4">
              <a
                href="/apply"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 sm:px-8 sm:py-4 text-sm font-bold uppercase tracking-wider text-primary shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-xl"
              >
                Apply for Membership
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#contact"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full border-2 border-white/30 bg-transparent px-7 py-3.5 sm:px-8 sm:py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
              >
                Contact Our Team
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

