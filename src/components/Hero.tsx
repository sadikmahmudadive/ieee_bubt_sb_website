"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { EventSummary } from "@/lib/actions";

const stats = [
  { label: "Workshops hosted", value: "40+" },
  { label: "Volunteers active", value: "180" },
  { label: "Industry mentors", value: "25" }
];

const fallbackSpotlight = {
  title: "Tech for Impact Summit",
  description: "Where sustainable innovation, humanitarian tech, and industry mentorship collide.",
  eventDate: "2025-11-15T00:00:00.000Z",
  location: "BUBT Auditorium"
};

const defaultSlides = [
  {
    title: fallbackSpotlight.title,
    subtitle: fallbackSpotlight.description,
    coverImage: "https://res.cloudinary.com/dqmqc0uaa/image/upload/v1728383200/ieee-bubt/events/hackathon.jpg",
    slug: undefined,
    eventDate: fallbackSpotlight.eventDate,
    location: fallbackSpotlight.location
  },
  {
    title: "Robotics Innovation Week",
    subtitle: "Prototype, code, and iterate on automation ideas with faculty mentors and IEEE tools.",
    coverImage: "https://res.cloudinary.com/dqmqc0uaa/image/upload/v1728383200/ieee-bubt/events/robotics-showcase.jpg",
    slug: undefined,
    eventDate: fallbackSpotlight.eventDate,
    location: "Labs & Innovation Zone"
  },
  {
    title: "Humanitarian Tech Lab",
    subtitle: "Build resilient solutions tackling real challenges across Bangladesh communities.",
    coverImage: "https://res.cloudinary.com/dqmqc0uaa/image/upload/v1728383200/ieee-bubt/events/hum-tech-lab.jpg",
    slug: undefined,
    eventDate: fallbackSpotlight.eventDate,
    location: "IEEE Makerspace"
  }
];

type HeroSlide = {
  key: string;
  title: string;
  subtitle: string;
  coverImage: string;
  slug?: string;
  eventDate?: string;
  location?: string;
};

type HeroProps = {
  events?: EventSummary[];
  spotlight?: EventSummary | null;
};

export function Hero({ events = [], spotlight }: HeroProps) {
  const heroSlides = useMemo<HeroSlide[]>(() => {
    const bySlug = new Set<string>();
    const ordered: EventSummary[] = [];

    const register = (event?: EventSummary | null) => {
      if (!event) return;
      const key = event.slug ?? event._id;
      if (bySlug.has(key)) return;
      bySlug.add(key);
      ordered.push(event);
    };

    register(spotlight ?? null);
    events.forEach((event) => register(event));

    if (ordered.length === 0) {
      return defaultSlides.map((slide, index) => ({
        key: `fallback-${index}`,
        ...slide
      }));
    }

    const fallbackImages = defaultSlides.map((slide) => slide.coverImage);

    return ordered.slice(0, 6).map((event, index) => {
      const rawSubtitle = event.heroSubtitle?.trim() || event.description;
      const subtitle = rawSubtitle.length > 220 ? `${rawSubtitle.slice(0, 217)}...` : rawSubtitle;

      return {
        key: event.slug ?? event._id,
        title: event.heroTitle?.trim() || event.title,
        subtitle,
        coverImage: event.coverImage || fallbackImages[index % fallbackImages.length],
        slug: event.slug,
        eventDate: event.eventDate,
        location: event.location
      } satisfies HeroSlide;
    });
  }, [events, spotlight]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [heroSlides]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [heroSlides]);

  const highlight = heroSlides[activeIndex] ?? heroSlides[0];
  const eventDate = highlight?.eventDate ? new Date(highlight.eventDate) : new Date(fallbackSpotlight.eventDate);
  const formattedEventDate = highlight?.eventDate
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(eventDate)
    : null;
  const primaryCtaHref = highlight?.slug ? `/events/${highlight.slug}` : "#events";
  const primaryCtaLabel = highlight?.slug ? "Explore Event" : "Discover IEEE BUBT SB";

  const headlineWords = (highlight?.title ?? fallbackSpotlight.title).trim().split(/\s+/);
  const emphasized = headlineWords.pop() ?? fallbackSpotlight.title;
  const baseHeadline = headlineWords.join(" ");

  return (
    <section className="relative isolate min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.key}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-out ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${slide.coverImage})` }}
          />
        ))}
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center gap-12 px-6 py-24">
        <div className="space-y-6 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em]">
            IEEE BUBT Student Branch
          </span>
          <h1 className="heading-font text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {baseHeadline ? <span>{baseHeadline} </span> : null}
            <span className="text-accent/80">{emphasized}</span>
          </h1>
          <p className="max-w-2xl text-base text-white/80 sm:text-lg">
            {highlight?.subtitle ||
              "The outstanding student branch where leadership, innovation, and community impact thrive together."}
          </p>
          {highlight?.eventDate || highlight?.location ? (
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/70">
              {highlight?.eventDate && formattedEventDate ? <span>{formattedEventDate}</span> : null}
              {highlight?.location ? (
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-white/40" />
                  {highlight.location}
                </span>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={primaryCtaHref}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent/90 to-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 shadow-[0_20px_60px_-20px_rgba(250,204,21,0.7)] transition hover:-translate-y-0.5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-900">
                <ArrowRightIcon className="h-4 w-4" />
              </span>
              {primaryCtaLabel}
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/10"
            >
              Get Involved
            </a>
          </div>
        </div>

        <div className="flex items-center gap-6 text-white/80">
          <div className="flex gap-6 text-sm uppercase tracking-[0.3em]">
            {stats.map((item) => (
              <div key={item.label} className="flex flex-col">
                <span className="heading-font text-2xl font-semibold text-white">{item.value}</span>
                <span className="text-xs text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {heroSlides.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4 sm:px-8">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="pointer-events-auto hidden h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-slate-950/50 text-white transition hover:border-white hover:bg-slate-950/70 lg:flex"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % heroSlides.length)}
            className="pointer-events-auto hidden h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-slate-950/50 text-white transition hover:border-white hover:bg-slate-950/70 lg:flex"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      ) : null}

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={`dot-${slide.key}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-8 rounded-full transition ${index === activeIndex ? "bg-amber-400" : "bg-white/30 hover:bg-white/50"}`}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
