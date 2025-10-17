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
import { getEvents, getFeaturedEvent, getGalleryItems, getTeamMembers, getNewsItems } from "@/lib/actions";
import type { EventSummary, GalleryItemSummary, TeamMemberSummary } from "@/lib/actions";

export const revalidate = 0;

export default async function HomePage() {
  let events: EventSummary[] = [];
  let team: TeamMemberSummary[] = [];
  let gallery: GalleryItemSummary[] = [];
  let featuredEvent: EventSummary | null = null;
  let newsItems: Awaited<ReturnType<typeof getNewsItems>> = [];

  if (process.env.MONGODB_URI) {
    [events, team, gallery, featuredEvent, newsItems] = await Promise.all([
      getEvents(),
      getTeamMembers(),
      getGalleryItems(),
      getFeaturedEvent(),
      getNewsItems()
    ]);
  }

  const heroSpotlight = featuredEvent ?? events[0] ?? null;

  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main>
        <Hero events={events} spotlight={heroSpotlight} />
        <HeroHighlights spotlight={heroSpotlight} />
        <AboutSection />
        <EventList events={events} />
        <TeamGrid team={team} />
  <GallerySection items={gallery} />
  <NewsSection items={newsItems} />
        <CallToAction />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
