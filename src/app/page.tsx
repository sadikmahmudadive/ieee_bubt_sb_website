import { AboutSection } from "@/components/AboutSection";
import { CallToAction } from "@/components/CallToAction";
import { ContactSection } from "@/components/ContactSection";
import { EventList } from "@/components/EventList";
import { Footer } from "@/components/Footer";
import { GallerySection } from "@/components/GallerySection";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { TeamGrid } from "@/components/TeamGrid";
import { getEvents, getFeaturedEvent, getGalleryItems, getTeamMembers } from "@/lib/actions";
import type { EventSummary, GalleryItemSummary, TeamMemberSummary } from "@/lib/actions";

export const revalidate = 0;

export default async function HomePage() {
  let events: EventSummary[] = [];
  let team: TeamMemberSummary[] = [];
  let gallery: GalleryItemSummary[] = [];
  let featuredEvent: EventSummary | null = null;

  if (process.env.MONGODB_URI) {
    [events, team, gallery, featuredEvent] = await Promise.all([
      getEvents(),
      getTeamMembers(),
      getGalleryItems(),
      getFeaturedEvent()
    ]);
  }

  const eventCovers = events.map((event) => event.coverImage).filter(Boolean);

  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main>
        <Hero eventCovers={eventCovers} spotlight={featuredEvent ?? events[0] ?? null} />
        <AboutSection />
        <EventList events={events} />
        <TeamGrid team={team} />
        <GallerySection items={gallery} />
        <CallToAction />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
