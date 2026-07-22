import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, RevealList } from "@/components/Reveal";
import type { EventSummary } from "@/lib/actions";
import { formatEventDateRange } from "@/utils/eventDates";

type EventListProps = {
  events: EventSummary[];
};

export function EventList({ events }: EventListProps) {
  return (
    <section id="events" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface via-white to-surface" aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Upcoming & Past Events"
            title="Experiences that Shape Future Engineers"
            subtitle="Explore the touchpoints where innovation, collaboration, and social good collide across our annual calendar."
            tone="light"
          />
        </Reveal>
        <div className={`mt-16 grid gap-6 grid-cols-1 ${events.length === 1 ? "md:grid-cols-1 max-w-2xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {events.length === 0 ? (
            <Reveal>
              <p className="col-span-full rounded-2xl border border-surface-strong bg-white p-10 text-center text-sm text-slate-500 shadow-card">
                Event calendar is being updated. Check back soon!
              </p>
            </Reveal>
          ) : (
            <RevealList interval={0.2}>
              {events.map((event) => (
                <article
                  key={event.slug}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-card-hover"
                >
                  <Link href={`/events/${event.slug}`} className="absolute inset-0 z-10" aria-label={`Read more about ${event.title}`} />
                  <div className="relative h-52 w-full overflow-hidden shrink-0">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${event.coverImage})` }}
                      aria-label={event.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                    {event.tags && event.tags.length > 0 && (
                      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5">
                        {event.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative z-20 flex flex-1 flex-col gap-4 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-primary">{formatEventDateRange(event.eventDate, event.eventEndDate)}</span>
                      {event.location && <span className="max-w-[50%] truncate text-right text-xs text-slate-400">{event.location}</span>}
                    </div>
                    <h3 className="heading-font text-xl font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-primary">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed flex-1">{event.description}</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 mt-auto">
                      <Link
                        href={`/events/${event.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary transition-all duration-200 hover:gap-2.5"
                      >
                        View Details <span>→</span>
                      </Link>
                      <a
                        href="#contact"
                        className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 transition-all duration-200 hover:text-primary hover:gap-2.5"
                      >
                        RSVP <span>→</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </RevealList>
          )}
        </div>
      </div>
    </section>
  );
}

