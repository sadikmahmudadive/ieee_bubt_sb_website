import Image from "next/image";
import Link from "next/link";
import { AboutSection } from "@/components/AboutSection";
import { CallToAction } from "@/components/CallToAction";
import { ContactSection } from "@/components/ContactSection";
import { EventList } from "@/components/EventList";
import { Footer } from "@/components/Footer";
import { GallerySection } from "@/components/GallerySection";
import { Hero } from "@/components/Hero";
import { HeroHighlights } from "@/components/HeroHighlights";
import { Navbar } from "@/components/Navbar";
import { NewsSection } from "@/components/NewsSection";
import { TeamGrid } from "@/components/TeamGrid";
import { ScrollVideoSection } from "@/components/ScrollVideoSection";
import { getEvents, getFeaturedEvent, getGalleryItems, getTeamMembers, getNewsItems } from "@/lib/actions";
import type { EventSummary, GalleryItemSummary, TeamMemberSummary } from "@/lib/actions";
import { chapterCatalog } from "@/utils/chapterCatalog";

export const revalidate = 0;

export default async function HomePage() {
  let events: EventSummary[] = [];
  let team: TeamMemberSummary[] = [];
  let gallery: GalleryItemSummary[] = [];
  let featuredEvent: EventSummary | null = null;
  let newsItems: Awaited<ReturnType<typeof getNewsItems>> = [];
  const currentYear = new Date().getFullYear().toString();

  if (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    const results = await Promise.all([
      getEvents(),
      getTeamMembers(),
      getGalleryItems(),
      getFeaturedEvent(),
      getNewsItems()
    ]);
    events = results[0];
    team = results[1];
    gallery = results[2];
    featuredEvent = results[3];
    newsItems = results[4];
  }

  const heroSpotlight = featuredEvent ?? events[0] ?? null;

  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main>
        <Hero events={events} spotlight={heroSpotlight} />
        <HeroHighlights spotlight={heroSpotlight} />
        <AboutSection />

        {/* Chapters Section */}
        <section className="relative py-12 sm:py-16 lg:py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" aria-hidden />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-8 sm:mb-10 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Our Chapters</p>
              <h2 className="heading-font mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">
                Meet the communities behind the branch
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {chapterCatalog.map((chapter) => (
                <Link
                  key={chapter.slug}
                  href={`/chapters/${chapter.slug}`}
                  className="group flex flex-col items-center rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex aspect-square w-full max-w-[100px] items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-white p-3 sm:max-w-[130px] sm:rounded-2xl sm:p-4 lg:max-w-[150px]">
                    <Image
                      src={chapter.logo}
                      alt={chapter.logoAlt}
                      width={140}
                      height={140}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs font-semibold leading-tight text-slate-800 sm:mt-4 sm:text-sm">{chapter.shortName}</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary sm:mt-1 sm:text-[10px]">View committee</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <EventList events={events} />
        <TeamGrid team={team} currentYear={currentYear} />
        <ScrollVideoSection />
        <GallerySection items={gallery} />
        <NewsSection items={newsItems} />
        <CallToAction />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

