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
        {/* Chapter logos */}
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="heading-font text-center text-2xl font-semibold text-slate-900 mb-6">
            Our Chapters
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
            <img src="/brand/logo%20CS.png" alt="IEEE Computer Society BUBT SBC" className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 transition-transform duration-300 hover:scale-110" />
            <img src="/brand/logo%20SC.png" alt="IEEE System Councile BUBT SBC" className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 transition-transform duration-300 hover:scale-110" />
            <img src="/brand/logo%20RAS.png" alt="IEEE Robotics and Automation Society BUBT SBC" className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 transition-transform duration-300 hover:scale-110" />
            <img src="/brand/logo%20PES.png" alt="IEEE Power and Energy Society BUBT SBC" className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 transition-transform duration-300 hover:scale-110" />
            <img src="/brand/logo%20PS.png" alt="IEEE Photonics Society BUBT SBC" className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 transition-transform duration-300 hover:scale-110" />
            <img src="/brand/logo%20PELS.png" alt="IEEE Power Electronics Society BUBT SBC" className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 transition-transform duration-300 hover:scale-110" />
            <img src="/brand/logo%20WIE.png" alt="IEEE BUBT Women in Engineering SB Affinity Group" className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 transition-transform duration-300 hover:scale-110" />
          </div>
        </div>
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
