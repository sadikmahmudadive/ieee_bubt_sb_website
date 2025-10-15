import { SectionHeading } from "@/components/SectionHeading";

const highlights = [
  {
    title: "Immersive Labs",
    description:
      "Deep-dive learning paths mixing hardware prototyping, AI experimentation, and design thinking sprints with mentors."
  },
  {
    title: "Competitions & Startups",
    description:
      "IEEE Xtreme preps, ideathons, and launchpads helping teams pitch impactful solutions and secure incubation support."
  },
  {
    title: "Humanitarian Tech",
    description:
      "Service learning projects delivering solar micro-grids, smart agriculture pilots, and accessibility tools across communities."
  }
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-24">
      <div className="absolute inset-0 -z-10 bg-white/95" aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="About IEEE BUBT SB"
          title="A Community of Visionary Technologists"
          subtitle="We cultivate a cross-disciplinary space where engineering talent, creative leadership, and social responsibility converge."
          tone="light"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="group relative flex flex-col gap-5 rounded-3xl border border-slate-200/60 bg-white p-8 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700">
                  {item.title.slice(0, 1)}
                </span>
              </div>
              <div className="relative space-y-4">
                <h3 className="heading-font text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
