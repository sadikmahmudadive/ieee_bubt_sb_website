import type { EventSummary } from "@/lib/actions";
import { fallbackSpotlight, heroStats } from "@/components/heroContent";
import { formatEventDateRange } from "@/utils/eventDates";

type HeroHighlightsProps = {
  spotlight?: EventSummary | null;
};

export function HeroHighlights({ spotlight }: HeroHighlightsProps) {
  const highlight = spotlight ?? null;
  const displayTitle = highlight?.title ?? fallbackSpotlight.title;
  const formattedDate = formatEventDateRange(
    highlight?.eventDate ?? fallbackSpotlight.eventDate,
    highlight?.eventEndDate
  );
  const location = highlight?.location ?? fallbackSpotlight.location;

  return (
    <section className="relative isolate py-10 sm:py-14">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-slate-100 via-transparent to-transparent" aria-hidden />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:gap-6 sm:px-6 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Spotlight Event</span>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:mt-3 sm:text-[1.75rem] lg:text-[1.9rem] leading-snug">{displayTitle}</h2>
          <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base">
            {formattedDate}
            {location ? ` • ${location}` : ""}
          </p>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-6">
          {heroStats.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center sm:p-4">
              <span className="heading-font block text-lg font-semibold text-slate-900 sm:text-xl lg:text-[1.5rem]">{item.value}</span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:text-[11px] sm:tracking-[0.28em]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

