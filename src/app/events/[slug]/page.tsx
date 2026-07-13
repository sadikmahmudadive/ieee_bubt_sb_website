import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import { getEventBySlug, getRecentEvents } from "@/lib/actions";
import { formatEventDateRange } from "@/utils/eventDates";

function formatDate(isoDate: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "TBD";
  }
  return date.toLocaleDateString(undefined, options ?? {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

type EventPageProps = {
  params: { slug: string };
};

export const revalidate = 0;

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    return {
      title: "Event Not Found | IEEE BUBT SB"
    };
  }

  const description = event.description.length > 150 ? `${event.description.slice(0, 147)}...` : event.description;

  return {
    title: `${event.title} | IEEE BUBT SB`,
    description,
    openGraph: {
      title: `${event.title} | IEEE BUBT SB`,
      description,
      type: "article",
      images: event.coverImage ? [{ url: event.coverImage, alt: event.title }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | IEEE BUBT SB`,
      description,
      images: event.coverImage ? [event.coverImage] : undefined
    }
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = await getRecentEvents(3, event.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ieee-bubt-sb.vercel.app";
  const descriptionBlocks = event.description
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  const detailBlocks = descriptionBlocks.length > 0 ? descriptionBlocks : [event.description];
  const [leadParagraph, ...supportingParagraphs] = detailBlocks;

  return (
    <div className="relative bg-white text-slate-900">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col gap-12 px-6 pb-24 pt-24">
        <div className="flex items-center justify-between">
          <Link
            href="/#events"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary transition hover:text-primary-dark"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Events
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-slate-500">Updated {formatDate(event.updatedAt)}</span>
        </div>

        <section className="overflow-hidden border border-slate-200 bg-white shadow-lg">
          <div className="relative h-80 w-full sm:h-[420px]">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" aria-hidden />
            <div className="absolute bottom-10 left-0 right-0 flex flex-col gap-4 px-8 text-white sm:px-12">
              <span className="inline-flex w-fit items-center gap-2 border border-white/40 bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                {formatEventDateRange(event.eventDate, event.eventEndDate)}
              </span>
              <h1 className="heading-font text-3xl font-semibold sm:text-4xl lg:text-5xl">{event.title}</h1>
              <p className="max-w-3xl text-sm text-white/90 sm:text-base">{leadParagraph}</p>
            </div>
          </div>

          <div className="grid gap-10 border-t border-slate-200 bg-white px-8 py-12 sm:px-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <article className="space-y-6 text-base text-slate-700">
              <p className="leading-relaxed text-slate-700">{leadParagraph}</p>
              {supportingParagraphs.map((paragraph, index) => (
                <p key={`paragraph-${index}`} className="leading-relaxed text-slate-700">
                  {paragraph}
                </p>
              ))}

              <div className="mt-10 border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h2 className="heading-font text-lg font-semibold text-slate-900">Ready to collaborate?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Reach out to the IEEE BUBT SB team to partner, volunteer, or request a guest pass for this event.
                </p>
                <Link
                  href="/#contact"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary transition hover:text-primary-dark"
                >
                  Contact Us
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>

            <aside className="space-y-6 border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700 shadow-sm">
              <div className="space-y-4">
                <h2 className="heading-font text-lg font-semibold text-slate-900">Event Overview</h2>
                <div className="flex items-start gap-3">
                  <CalendarDaysIcon className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Date</p>
                    <p className="mt-1 text-sm text-slate-900 font-medium">
                      {formatEventDateRange(event.eventDate, event.eventEndDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Location</p>
                    <p className="mt-1 text-sm text-slate-900 font-medium">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Published</p>
                    <p className="mt-1 text-sm text-slate-900 font-medium">{formatDate(event.createdAt)}</p>
                  </div>
                </div>
                {event.tags?.length ? (
                  <div className="flex items-start gap-3">
                    <TagIcon className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">Tags</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-slate-500">Share</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wider text-slate-700">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(`${siteUrl}/events/${event.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-slate-200 bg-slate-50 px-3 py-1 transition hover:border-primary hover:text-primary"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/events/${event.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-slate-200 bg-slate-50 px-3 py-1 transition hover:border-primary hover:text-primary"
                  >
                    Facebook
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(`${event.description}\n\n${siteUrl}/events/${event.slug}`)}`}
                    className="border border-slate-200 bg-slate-50 px-3 py-1 transition hover:border-primary hover:text-primary"
                  >
                    Email
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {relatedEvents.length > 0 ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-t border-slate-200 pt-10">
              <h2 className="heading-font text-2xl font-semibold text-slate-900">More from IEEE BUBT SB</h2>
              <Link
                href="/#events"
                className="text-xs font-semibold uppercase tracking-wider text-primary transition hover:text-primary-dark"
              >
                View All Events →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedEvents.map((item) => (
                <Link
                  key={item.slug}
                  href={`/events/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="h-44 w-full overflow-hidden">
                    <div
                      className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${item.coverImage})` }}
                      aria-hidden
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500">
                      {formatEventDateRange(item.eventDate, item.eventEndDate)}
                    </span>
                    <h3 className="heading-font text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3">{item.description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary transition group-hover:text-primary-dark">
                      Explore Event
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
