import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { CallToAction } from "@/components/CallToAction";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { getTeamMembers } from "@/lib/actions";
import type { TeamMemberSummary } from "@/lib/actions";
import { siteMetadata } from "@/utils/siteMetadata";
import { chapterFallbackName, groupChapterMembers } from "@/utils/teamGrouping";

type ChapterPageProps = {
  params: {
    slug: string;
  };
};

async function fetchChapterEntries() {
  let members: TeamMemberSummary[] = [];

  if (process.env.MONGODB_URI) {
    members = await getTeamMembers();
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="space-y-24 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/5 py-24 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-slate-900 to-slate-950" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/40 via-transparent to-transparent blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Chapter Leadership</p>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">{chapter.name}</h1>
            <p className="mt-6 text-base text-slate-200 sm:text-lg">
              Advisors and committee members drive programs, membership engagement, and technical initiatives for this IEEE community at BUBT.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/chapters"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/10"
              >
                Back to Chapters Directory
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 transition hover:-translate-y-0.5"
              >
                Collaborate with {hasNamedChapter ? chapter.name : "this Chapter"}
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-14 px-6 sm:px-8">
          <SectionHeading
            eyebrow="Faculty Mentors"
            title="Advisors and counselors guiding chapter strategy"
            subtitle="Each chapter thrives with faculty support linking student work to IEEE’s regional and global programs."
          />
          {chapter.advisors.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {chapter.advisors.map((member) => (
                <TeamMemberCard key={member._id} member={member} />
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 text-sm text-slate-200">
              Add chapter advisors in the admin dashboard to highlight them here.
            </p>
          )}
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-14 px-6 sm:px-8">
          <SectionHeading
            eyebrow="Student Committee"
            title="Officers and coordinators leading daily chapter operations"
            subtitle="Student volunteers plan initiatives, recruit members, and deliver technical events for the community."
          />
          {chapter.committee.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {chapter.committee.map((member) => (
                <TeamMemberCard key={member._id} member={member} />
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 text-sm text-slate-200">
              Committee members will appear once they are added to this chapter.
            </p>
          )}
        </section>

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
