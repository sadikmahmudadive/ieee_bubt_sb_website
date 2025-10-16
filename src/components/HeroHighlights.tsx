import type { EventSummary } from "@/lib/actions";
import { fallbackSpotlight, heroStats } from "@/components/heroContent";

type HeroHighlightsProps = {
  spotlight?: EventSummary | null;
};

export function HeroHighlights({ spotlight }: HeroHighlightsProps) {
  const highlight = spotlight ?? null;
  const displayTitle = highlight?.title ?? fallbackSpotlight.title;
  const displayDate = highlight?.eventDate ? new Date(highlight.eventDate) : new Date(fallbackSpotlight.eventDate);
  const formattedDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(displayDate);
  const location = highlight?.location ?? fallbackSpotlight.location;

  return (
    <section className="relative isolate py-14">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-white/12 via-transparent to-transparent" aria-hidden />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="flex-1 rounded-[26px] border border-white/10 bg-white/6 p-7 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-light/90">Spotlight Event</span>
          <h2 className="mt-3 text-[1.75rem] font-semibold text-white sm:text-[1.9rem]">{displayTitle}</h2>
          <p className="mt-3 text-sm text-white/70 sm:text-base">
            {formattedDate}
            {location ? ` • ${location}` : ""}
          </p>
        </div>
        <div className="grid flex-1 gap-4 rounded-[26px] border border-white/10 bg-white/6 p-6 backdrop-blur sm:grid-cols-3">
          {heroStats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/8 bg-white/8 p-4 text-center">
              <span className="heading-font block text-xl font-semibold text-white sm:text-[1.5rem]">{item.value}</span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-white/60">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
