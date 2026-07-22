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
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-surface to-white" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-[size:40px_40px]" style={{ backgroundImage: "linear-gradient(to right, rgba(148,163,184,0.05) 1px, transparent 0), linear-gradient(to bottom, rgba(148,163,184,0.05) 1px, transparent 0)" }} aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="About IEEE BUBT SB"
            title="A Community of Visionary Technologists"
            subtitle="We cultivate a cross-disciplinary space where engineering talent, creative leadership, and social responsibility converge."
            tone="light"
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <RevealList interval={0.15}>
            {highlights.map((item) => (
              <article
                key={item.title}
                className="group relative flex h-full flex-col gap-5 rounded-[5px] border border-border bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:border-cyan-soft hover:shadow-[0_0_2px_2px_rgba(204,204,204,1)] sm:p-8"
              >
                <div className="relative">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-soft bg-cyan/10 text-sm font-semibold text-primary">
                    {item.title.slice(0, 1)}
                  </span>
                </div>
                <div className="relative space-y-4">
                  <h3 className="heading-font text-xl font-light text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </article>
            ))}
          </RevealList>
        </div>
      </div>
    </section>
  );
}
