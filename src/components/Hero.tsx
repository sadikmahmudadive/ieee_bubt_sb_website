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
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[1500ms] ease-out ${index === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            style={{ backgroundImage: `url(${slide.coverImage})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/50 to-slate-950/30 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20" />
      </div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center gap-12 px-6 py-32 lg:flex-row lg:items-center lg:gap-20">
        <div className="max-w-3xl space-y-10 text-white animate-fade-in">
          <span className="inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-white/90 shadow-lg">
            <span className="relative h-8 w-8 overflow-hidden rounded-full border border-white/30 bg-white/15 p-1.5">
              <Image
                src={siteMetadata.brand?.logo.src ?? "/brand/ieee-bubt-sb-logo.svg"}
                alt={siteMetadata.brand?.logo.alt ?? "IEEE BUBT Student Branch logo"}
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </span>
            IEEE BUBT Student Branch
          </span>
          <h1 className="heading-font text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            {baseHeadline ? <span className="text-white/95">{baseHeadline} </span> : null}
            <span className="bg-gradient-to-r from-primary-light via-amber-300 to-primary bg-clip-text text-transparent animate-pulse">
              {emphasized}
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-white/80 sm:text-xl leading-relaxed">
            {highlight?.subtitle ||
              "An inclusive community where emerging engineers collaborate with mentors and industry to deliver meaningful technology."}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={primaryCtaHref}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-white to-slate-100 px-8 py-4 text-sm font-bold uppercase tracking-[0.28em] text-slate-950 transition-all duration-300 hover:shadow-2xl hover:shadow-white/25 hover:-translate-y-1"
            >
              <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              {primaryCtaLabel}
            </Link>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-bold uppercase tracking-[0.28em] text-white transition-all duration-300 hover:border-primary-light hover:bg-primary-light/10 hover:shadow-xl hover:shadow-primary-light/20"
            >
              Get Involved
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {highlight?.eventDate && (
          <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
              <div className="text-center space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Next Event</p>
                <p className="text-2xl font-bold text-white">
                  {new Date(highlight.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-white/80 uppercase tracking-[0.2em]">
                  {new Date(highlight.eventDate).toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                {highlight.location && (
                  <p className="text-xs text-white/60 mt-2">{highlight.location}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {heroSlides.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-6 sm:px-12">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="pointer-events-auto hidden h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-slate-950/40 backdrop-blur-xl text-white transition-all duration-300 hover:border-white hover:bg-white/10 hover:shadow-xl hover:shadow-white/20 lg:flex"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % heroSlides.length)}
            className="pointer-events-auto hidden h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-slate-950/40 backdrop-blur-xl text-white transition-all duration-300 hover:border-white hover:bg-white/10 hover:shadow-xl hover:shadow-white/20 lg:flex"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-7 w-7" />
          </button>
        </div>
      ) : null}

      <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-3">
        {heroSlides.map((slide, index) => (
          <button
            key={`dot-${slide.key}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-3 rounded-full transition-all duration-500 ${
              index === activeIndex
                ? "w-12 bg-gradient-to-r from-primary-light to-amber-400 shadow-lg shadow-primary-light/30"
                : "w-3 bg-white/40 hover:bg-white/60 hover:shadow-md"
            }`}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
