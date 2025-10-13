import { SectionHeading } from "@/components/SectionHeading";

const highlights = [
  {
    title: "Immersive Labs",
    description:
      "Deep-dive learning paths mixing hardware prototyping, AI experimentation, and design thinking sprints with mentors.",
    gradient: "from-blue-500/30 to-cyan-500/10"
  },
  {
    title: "Competitions & Startups",
    description:
      "IEEE Xtreme preps, ideathons, and launchpads helping teams pitch impactful solutions and secure incubation support.",
    gradient: "from-purple-500/30 to-indigo-500/10"
  },
  {
    title: "Humanitarian Tech",
    description:
      "Service learning projects delivering solar micro-grids, smart agriculture pilots, and accessibility tools across communities.",
    gradient: "from-amber-500/30 to-pink-500/10"
  }
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-28">
      <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-slate-900/40 via-transparent to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="About IEEE BUBT SB"
          title="A Community of Visionary Technologists"
          subtitle="We cultivate a cross-disciplinary space where engineering talent, creative leadership, and social responsibility converge."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="group relative rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/30"
            >
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 transition group-hover:opacity-100`} aria-hidden />
              <div className="relative space-y-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-slate-950/70 text-white shadow-inner-card">
                  {item.title.slice(0, 1)}
                </span>
                <h3 className="heading-font text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary-light opacity-0 transition group-hover:opacity-100">
                  <span>Discover More</span>
                  <span aria-hidden>→</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
