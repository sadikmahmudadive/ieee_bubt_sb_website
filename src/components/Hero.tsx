"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { EventSummary } from "@/lib/actions";
import { siteMetadata } from "@/utils/siteMetadata";
import { defaultSlides, fallbackSpotlight } from "@/components/heroContent";

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
  const primaryCtaHref = highlight?.slug ? `/events/${highlight.slug}` : "#events";
  const primaryCtaLabel = highlight?.slug ? "Explore Event" : "Discover IEEE BUBT SB";

  const headlineWords = (highlight?.title ?? fallbackSpotlight.title).trim().split(/\s+/);
  const emphasized = headlineWords.pop() ?? fallbackSpotlight.title;
  const baseHeadline = headlineWords.join(" ");

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.key}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-out ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${slide.coverImage})` }}
          />
        ))}
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/60 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center gap-12 px-6 py-24 lg:flex-row lg:items-center lg:gap-16">
        <div className="max-w-2xl space-y-8 text-white">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.32em] text-white/80">
            <span className="relative h-7 w-7 overflow-hidden rounded-full border border-white/20 bg-white/10 p-1">
              <Image
                src={siteMetadata.brand?.logo.src ?? "/brand/ieee-bubt-sb-logo.svg"}
                alt={siteMetadata.brand?.logo.alt ?? "IEEE BUBT Student Branch logo"}
                fill
                sizes="28px"
                className="object-contain"
                priority
              />
            </span>
            IEEE BUBT Student Branch
          </span>
          <h1 className="heading-font text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.5rem]">
            {baseHeadline ? <span>{baseHeadline} </span> : null}
            <span className="text-primary-light">{emphasized}</span>
          </h1>
          <p className="max-w-xl text-base text-white/75 sm:text-lg">
            {highlight?.subtitle ||
              "An inclusive community where emerging engineers collaborate with mentors and industry to deliver meaningful technology."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryCtaHref}
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-slate-950 transition hover:bg-slate-100"
            >
              <ArrowRightIcon className="h-4 w-4" />
              {primaryCtaLabel}
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white transition hover:border-primary-light hover:text-primary-light"
            >
              Get Involved
            </a>
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
