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
    <section id="events" className="relative py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-surface to-white" aria-hidden />
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
              <p className="col-span-full rounded-[5px] border border-border bg-white p-10 text-center text-sm text-slate-600 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                Event calendar is being updated. Check back soon!
              </p>
            </Reveal>
          ) : (
            <RevealList interval={0.2}>
              {events.map((event) => (
                <article
                  key={event.slug}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[5px] border border-border bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:border-cyan-soft hover:shadow-[0_0_2px_2px_rgba(204,204,204,1)]"
                >
                  <Link href={`/events/${event.slug}`} className="absolute inset-0 z-10" aria-label={`Read more about ${event.title}`} />
                  <div className="h-48 sm:h-56 w-full overflow-hidden shrink-0">
                    <div
                      className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${event.coverImage})` }}
                      aria-label={event.title}
                    />
                  </div>
                  <div className="relative z-20 flex flex-1 flex-col gap-4 sm:gap-5 p-5 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] uppercase tracking-[0.18em] text-slate-500">
                      <span className="font-semibold text-primary">{formatEventDateRange(event.eventDate, event.eventEndDate)}</span>
                      <span className="max-w-[50%] truncate text-right text-slate-600">{event.location}</span>
                    </div>
                    <h3 className="heading-font text-xl font-light leading-snug text-slate-900 sm:text-[1.35rem]">{event.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{event.description}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {event.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-4 border-t border-slate-100 mt-2">
                      <Link
                        href={`/events/${event.slug}`}
                        className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary transition hover:text-primary-dark hover:underline hover:underline-offset-8"
                      >
                        View Details
                        <span aria-hidden>→</span>
                      </Link>
                      <a
                        href="#contact"
                        className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 transition hover:text-primary-dark hover:underline hover:underline-offset-8 sm:ml-auto"
                      >
                        RSVP
                        <span aria-hidden>→</span>
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
