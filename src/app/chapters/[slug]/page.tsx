import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CallToAction } from "@/components/CallToAction";
import { ChapterCommittee } from "@/components/ChapterCommittee";
import { getSiteSettings, getTeamMembers } from "@/lib/actions";
import type { TeamMemberSummary } from "@/lib/actions";
import { siteMetadata } from "@/utils/siteMetadata";
import { chapterFallbackName, groupChapterMembers } from "@/utils/teamGrouping";
import { getChapterTheme } from "../../../utils/chapterThemes";
import { chapterCatalog } from "@/utils/chapterCatalog";

type ChapterPageProps = {
  params: {
    slug: string;
  };
};

async function fetchChapterEntries() {
  let members: TeamMemberSummary[] = [];

  try {
    members = await getTeamMembers();
  } catch (error) {
    console.error("Failed to fetch team members", error);
  }

  return groupChapterMembers(members);
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const chapterEntries = await fetchChapterEntries();
  const chapter = chapterEntries.find((entry) => entry.slug === params.slug);

  if (!chapter) {
    return {
      title: `Chapter Not Found | ${siteMetadata.title}`,
      description: "The requested IEEE BUBT SB chapter could not be located."
    };
  }

  return {
    title: `${chapter.name} | ${siteMetadata.title}`,
    description: `Meet the advisors and committee members leading ${chapter.name} at IEEE BUBT SB.`
  };
}

export const revalidate = 0;

export default async function ChapterDetailPage({ params }: ChapterPageProps) {
  const chapterEntries = await fetchChapterEntries();
  const chapter = chapterEntries.find((entry) => entry.slug === params.slug);

  if (!chapter) {
    notFound();
  }

  const hasNamedChapter = chapter.name !== chapterFallbackName;
  const theme = getChapterTheme(chapter.slug);
  const { currentYear } = await getSiteSettings();
  const catalogEntry = chapterCatalog.find((entry) => entry.slug === chapter.slug);
  const entityLabel = catalogEntry?.kind === "affinity-group" ? "Affinity Group" : "Chapter";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="space-y-24 pb-24">
        <section className="relative isolate overflow-hidden border-b border-slate-200 py-28 sm:py-36">
          <div className="absolute inset-0 animate-pulse" aria-hidden style={{ backgroundImage: theme.heroGradient }} />
          <div className="absolute inset-x-0 top-0 h-48 blur-3xl animate-pulse" aria-hidden style={{ backgroundImage: theme.heroOverlay }} />
          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary animate-fade-in">{entityLabel} Leadership</p>
            <h1 className="mt-6 text-4xl font-bold text-slate-900 sm:text-[2.75rem] animate-fade-in-up">{chapter.name}</h1>
            <p className="mt-6 text-base sm:text-lg animate-fade-in-up animation-delay-200" style={{ color: theme.heroMetaColor }}>
              Advisors and committee members drive programs, membership engagement, and technical initiatives for this IEEE community at BUBT.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up animation-delay-400">
              <Link
                href="/chapters"
                className="inline-flex items-center justify-center rounded-none border border-slate-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-700 transition hover:border-primary hover:text-primary hover:bg-slate-50"
              >
                Back to Chapters Directory
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-none border border-primary bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-primary-dark hover:border-primary-dark"
              >
                Collaborate with {hasNamedChapter ? chapter.name : "this Chapter"}
              </Link>
            </div>
          </div>
        </section>

        <ChapterCommittee advisors={chapter.advisors} committee={chapter.committee} currentYear={currentYear} />

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
