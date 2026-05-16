import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { CallToAction } from "@/components/CallToAction";
import { getTeamMembers } from "@/lib/actions";
import type { TeamMemberSummary } from "@/lib/actions";
import { siteMetadata } from "@/utils/siteMetadata";
import { chapterFallbackName, groupChapterMembers } from "@/utils/teamGrouping";
import { getChapterTheme } from "../../utils/chapterThemes";

export const metadata: Metadata = {
  title: `Chapters & Affinity Groups | ${siteMetadata.title}`,
  description:
    "Explore IEEE BUBT SB student branch chapters and affinity groups, including their advisors and committee members."
};

export const revalidate = 0;

export default async function ChaptersIndexPage() {
  let members: TeamMemberSummary[] = [];

  try {
    members = await getTeamMembers();
  } catch (error) {
    console.error("Failed to fetch team members", error);
  }

  const chapterEntries = groupChapterMembers(members);
  const unnamedChapterCount = chapterEntries.filter((chapter) => chapter.name === chapterFallbackName).length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="space-y-24 pb-24">
        <section className="relative isolate overflow-hidden border-b border-slate-200 py-24 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-blue-100/50 via-transparent to-transparent" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Chapters & Affinity Groups</p>
            <h1 className="mt-6 text-4xl font-bold text-slate-900 sm:text-[2.75rem]">Extending IEEE across disciplines at BUBT</h1>
            <p className="mt-6 text-base text-slate-600 sm:text-lg">
              Collaborative committees and faculty mentors empower every IEEE BUBT SB chapter and affinity group. Browse each team to meet
              the advisors and student leaders driving their initiatives.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/leadership"
                className="inline-flex items-center justify-center rounded-none border border-primary bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-primary-dark hover:border-primary-dark"
              >
                View Main Branch Leadership
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-none border-2 border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-700 transition hover:border-primary hover:text-primary hover:bg-slate-50"
              >
                Partner with a Chapter
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
          <SectionHeading
            eyebrow="Student Branch Chapters"
            title="Chairs, advisors, and committees at a glance"
            subtitle="Select a chapter or affinity group to view detailed rosters, advisors, and committee leads."
            tone="light"
          />
          {chapterEntries.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {chapterEntries.map((chapter) => {
                const theme = getChapterTheme(chapter.slug);

                return (
                  <article
                    key={chapter.slug}
                    className="group flex flex-col gap-6 border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                  <div className="space-y-2 border-b border-slate-200 pb-4">
                    <h2 className="heading-font text-lg font-semibold text-slate-900">{chapter.name}</h2>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">
                      {chapter.advisors.length} advisor{chapter.advisors.length === 1 ? "" : "s"} · {chapter.committee.length} committee member
                      {chapter.committee.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="space-y-3 text-sm">
                    {chapter.advisors.slice(0, 2).map((member) => (
                      <div
                        key={`${chapter.slug}-${member._id}`}
                        className="flex flex-col border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <span className="heading-font text-sm font-semibold text-slate-900">{member.name}</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-500">
                          {member.role}
                        </span>
                      </div>
                    ))}
                    {chapter.committee.slice(0, 2).map((member) => (
                      <div
                        key={`${chapter.slug}-${member._id}`}
                        className="flex flex-col border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <span className="heading-font text-sm font-semibold text-slate-900">{member.name}</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-500">
                          {member.role}
                        </span>
                      </div>
                    ))}
                    {chapter.advisors.length + chapter.committee.length > 4 ? (
                      <p className="text-xs text-slate-500">
                        {chapter.advisors.length + chapter.committee.length - 4} additional member
                        {chapter.advisors.length + chapter.committee.length - 4 === 1 ? "" : "s"} featured on the chapter page.
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href={`/chapters/${chapter.slug}`}
                    className="mt-auto inline-flex items-center justify-center border border-primary bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-primary-dark hover:border-primary-dark"
                  >
                    View Chapter Leadership →
                  </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 shadow-sm">
              Add chapter or affinity group members in the admin dashboard to populate this directory.
            </p>
          )}
          {unnamedChapterCount > 0 ? (
            <p className="text-xs text-amber-600">
              {unnamedChapterCount} chapter entr{unnamedChapterCount === 1 ? "y" : "ies"} still use the default name. Edit those records in the admin dashboard to set
              the official chapter title for accurate listings.
            </p>
          ) : null}
        </section>

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
