"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { EventSummary } from "@/lib/actions";
import { siteMetadata } from "@/utils/siteMetadata";
import { defaultSlides, fallbackSpotlight } from "@/components/heroContent";
import { formatEventDateRange } from "@/utils/eventDates";
import { motion, AnimatePresence } from "framer-motion";

type HeroSlide = {
  key: string;
  title: string;
  subtitle: string;
  coverImage: string;
  videoUrl?: string;
  slug?: string;
  eventDate?: string;
  eventEndDate?: string;
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
        videoUrl: event.videoUrl,
        slug: event.slug,
        eventDate: event.eventDate,
        eventEndDate: event.eventEndDate,
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
      <div className="absolute inset-0 bg-primary-navy" aria-hidden>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.key}
            className={`absolute inset-0 overflow-hidden bg-cover bg-center transition-all duration-[1500ms] ease-out ${index === activeIndex ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-105"}`}
            style={{ backgroundImage: `url(${slide.coverImage})` }}
          >
            {slide.videoUrl ? (
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload={index === 0 ? "metadata" : "none"}
                poster={slide.coverImage}
                aria-label={`${slide.title} background video`}
              >
                <source src={slide.videoUrl} />
              </video>
            ) : null}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071d2d]/95 via-[#003b5c]/78 to-[#00629b]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071d2d]/90 via-transparent to-black/20" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end gap-8 px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:min-h-[760px] lg:flex-row lg:items-end lg:px-12 lg:pb-24 lg:gap-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={highlight.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-3xl space-y-6 text-white sm:space-y-8 lg:space-y-10"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 sm:gap-4 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/90 shadow-lg"
            >
              <span className="relative h-6 w-6 sm:h-8 sm:w-8 overflow-hidden rounded-full border border-white/30 bg-white/15 p-1 sm:p-1.5 shrink-0">
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
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="heading-font text-4xl font-light leading-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            >
              {baseHeadline ? <span className="text-white/95">{baseHeadline} </span> : null}
              <span className="text-white">{emphasized}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-xl text-base text-white/80 sm:text-lg sm:max-w-2xl lg:text-xl leading-relaxed"
            >
              {highlight?.subtitle ||
                "An inclusive community where emerging engineers collaborate with mentors and industry to deliver meaningful technology."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Link
                href={primaryCtaHref}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 sm:px-8 sm:py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5"
              >
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                {primaryCtaLabel}
              </Link>
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-3 rounded-full border-2 border-white bg-transparent px-6 py-3.5 sm:px-8 sm:py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-primary hover:shadow-lg"
              >
                Get Involved
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {highlight?.eventDate && (
          <motion.div
            key={`card-${highlight.key}`}
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="hidden lg:block shrink-0"
          >
            <div className="rounded-[28px] border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-2xl transition-transform hover:scale-105 duration-500 min-w-[200px]">
              <div className="text-center space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Next Event</p>
                <p className="text-xl font-semibold text-white">
                  {formatEventDateRange(highlight.eventDate, highlight.eventEndDate)}
                </p>
                {highlight.location && (
                  <p className="text-xs text-white/60 mt-2">{highlight.location}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {heroSlides.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4 sm:px-8">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="pointer-events-auto flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 sm:border-2 bg-slate-950/40 backdrop-blur-xl text-white transition-all duration-300 hover:border-white hover:bg-white/10 hover:shadow-xl"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-5 w-5 sm:h-7 sm:w-7" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % heroSlides.length)}
            className="pointer-events-auto flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 sm:border-2 bg-slate-950/40 backdrop-blur-xl text-white transition-all duration-300 hover:border-white hover:bg-white/10 hover:shadow-xl"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-5 w-5 sm:h-7 sm:w-7" />
          </button>
        </div>
      ) : null}

      <div className="absolute bottom-6 sm:bottom-10 left-1/2 flex -translate-x-1/2 gap-2 sm:gap-3">
        {heroSlides.map((slide, index) => (
          <button
            key={`dot-${slide.key}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
              index === activeIndex
                ? "w-8 sm:w-12 bg-white shadow-md"
                : "w-4 sm:w-6 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

