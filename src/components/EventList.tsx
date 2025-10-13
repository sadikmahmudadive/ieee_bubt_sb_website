import { SectionHeading } from "@/components/SectionHeading";
import type { EventSummary } from "@/lib/actions";

type EventListProps = {
  events: EventSummary[];
};

export function EventList({ events }: EventListProps) {
  return (
    <section id="events" className="relative py-28">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900/40 via-transparent to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Upcoming & Past Events"
          title="Experiences that Shape Future Engineers"
          subtitle="Explore the touchpoints where innovation, collaboration, and social good collide across our annual calendar."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {events.length === 0 ? (
            <p className="col-span-full rounded-3xl border border-white/15 bg-slate-950/70 p-10 text-center text-sm text-slate-200">
              Event calendar is being updated. Check back soon!
            </p>
          ) : (
            events.map((event) => (
              <article
                key={event.slug}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-950/70 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.85)] backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-white/30"
              >
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/40 via-transparent to-transparent opacity-70 transition duration-500 group-hover:opacity-100" aria-hidden />
                <div className="h-56 w-full overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${event.coverImage})` }}
                    aria-label={event.title}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-5 p-8">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-slate-200">
                    <span>{new Date(event.eventDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="truncate text-right text-primary-light">{event.location}</span>
                  </div>
                  <h3 className="heading-font text-2xl font-semibold text-white">{event.title}</h3>
                  <p className="text-sm text-slate-200 line-clamp-3">{event.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {event.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary-light transition hover:text-white"
                  >
                    RSVP Today
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
