import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import type { EventSummary } from "@/lib/actions";

type EventListProps = {
  events: EventSummary[];
};

export function EventList({ events }: EventListProps) {
  return (
    <section id="events" className="relative py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-sky-50/40" aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Upcoming & Past Events"
          title="Experiences that Shape Future Engineers"
          subtitle="Explore the touchpoints where innovation, collaboration, and social good collide across our annual calendar."
          tone="light"
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {events.length === 0 ? (
            <p className="col-span-full rounded-3xl border border-slate-200/60 bg-white p-10 text-center text-sm text-slate-600 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.15)]">
              Event calendar is being updated. Check back soon!
            </p>
          ) : (
            events.map((event) => (
              <article
                key={event.slug}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_22px_45px_-28px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-1"
              >
                <Link href={`/events/${event.slug}`} className="absolute inset-0 z-10" aria-label={`Read more about ${event.title}`} />
                <div className="h-56 w-full overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${event.coverImage})` }}
                    aria-label={event.title}
                  />
                </div>
                <div className="relative z-20 flex flex-1 flex-col gap-5 p-8">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-slate-500">
                    <span>{new Date(event.eventDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="truncate text-right text-primary">{event.location}</span>
                  </div>
                  <h3 className="heading-font text-[1.35rem] font-semibold text-slate-900">{event.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {event.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-sky-50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.26em] text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      href={`/events/${event.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary transition hover:text-slate-900"
                    >
                      View Details
                      <span aria-hidden>→</span>
                    </Link>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:text-slate-900"
                    >
                      RSVP Today
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
