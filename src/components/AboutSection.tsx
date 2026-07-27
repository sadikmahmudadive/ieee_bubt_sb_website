import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, RevealList } from "@/components/Reveal";

const highlights = [
  {
    icon: "🔬",
    title: "Immersive Labs",
    description:
      "Deep-dive learning paths mixing hardware prototyping, AI experimentation, and design thinking sprints with mentors."
  },
  {
    icon: "🚀",
    title: "Competitions & Startups",
    description:
      "IEEE Xtreme preps, ideathons, and launchpads helping teams pitch impactful solutions and secure incubation support."
  },
  {
    icon: "🌱",
    title: "Humanitarian Tech",
    description:
      "Service learning projects delivering solar micro-grids, smart agriculture pilots, and accessibility tools across communities."
  }
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-surface to-white" aria-hidden />
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.05) 1px, transparent 0), linear-gradient(to bottom, rgba(148,163,184,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="About IEEE BUBT SB"
            title="A Community of Visionary Technologists"
            subtitle="We cultivate a cross-disciplinary space where engineering talent, creative leadership, and social responsibility converge."
            tone="light"
          />
        </Reveal>

        <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
          <RevealList interval={0.15}>
            {highlights.map((item) => (
              <article
                key={item.title}
                className="group relative flex h-full flex-col gap-4 sm:gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover"
              >
                <div className="relative">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-soft/10 text-xl sm:text-2xl ring-1 ring-primary/10 transition-all duration-300 group-hover:from-primary/20 group-hover:to-cyan-soft/20">
                    {item.icon}
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="heading-font text-base sm:text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500">{item.description}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </article>
            ))}
          </RevealList>
        </div>
      </div>
    </section>
  );
}

