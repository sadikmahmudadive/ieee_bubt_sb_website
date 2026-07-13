import Image from "next/image";
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
import { getEvents, getFeaturedEvent, getGalleryItems, getTeamMembers, getNewsItems, getSiteSettings } from "@/lib/actions";
import type { EventSummary, GalleryItemSummary, TeamMemberSummary } from "@/lib/actions";

export const revalidate = 0;

const chapterLogos = [
  { src: "/brand/logo%20CS.png", alt: "IEEE Computer Society BUBT SBC", name: "Computer Society" },
  { src: "/brand/logo%20SC.png", alt: "IEEE System Council BUBT SBC", name: "Systems Council" },
  { src: "/brand/logo%20RAS.png", alt: "IEEE Robotics and Automation Society BUBT SBC", name: "Robotics & Automation" },
  { src: "/brand/logo%20PES.png", alt: "IEEE Power and Energy Society BUBT SBC", name: "Power & Energy" },
  { src: "/brand/logo%20PS.png", alt: "IEEE Photonics Society BUBT SBC", name: "Photonics Society" },
  { src: "/brand/logo%20PELS.png", alt: "IEEE Power Electronics Society BUBT SBC", name: "Power Electronics" },
  { src: "/brand/logo%20WIE.png", alt: "IEEE BUBT Women in Engineering SB Affinity Group", name: "Women in Engineering" }
];

export default async function HomePage() {
  let events: EventSummary[] = [];
  let team: TeamMemberSummary[] = [];
  let gallery: GalleryItemSummary[] = [];
  let featuredEvent: EventSummary | null = null;
  let newsItems: Awaited<ReturnType<typeof getNewsItems>> = [];
  let currentYear = new Date().getFullYear().toString();

  if (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    const results = await Promise.all([
      getEvents(),
      getTeamMembers(),
      getGalleryItems(),
      getFeaturedEvent(),
      getNewsItems(),
      getSiteSettings()
    ]);
    events = results[0];
    team = results[1];
    gallery = results[2];
    featuredEvent = results[3];
    newsItems = results[4];
    currentYear = results[5].currentYear;
  }

  const heroSpotlight = featuredEvent ?? events[0] ?? null;

  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main>
        <Hero events={events} spotlight={heroSpotlight} />
        <HeroHighlights spotlight={heroSpotlight} />
        <AboutSection />
        <section className="relative py-16">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" aria-hidden />
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Our Chapters</p>
              <h2 className="heading-font mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Meet the communities behind the branch
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {chapterLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="group flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex aspect-square w-full max-w-[150px] items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-white p-4">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={140}
                      height={140}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-center text-sm font-semibold text-slate-800">{logo.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <EventList events={events} />
        <TeamGrid team={team} currentYear={currentYear} />
        <GallerySection items={gallery} />
        <NewsSection items={newsItems} />
        <CallToAction />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
