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

  if (process.env.MONGODB_URI) {
    members = await getTeamMembers();
  }

  const chapterEntries = groupChapterMembers(members);
  const unnamedChapterCount = chapterEntries.filter((chapter) => chapter.name === chapterFallbackName).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="space-y-24 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/5 py-24 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-950 to-slate-950" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-primary/55 via-white/8 to-transparent blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Chapters & Affinity Groups</p>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-[2.75rem]">Extending IEEE across disciplines at BUBT</h1>
            <p className="mt-6 text-base text-slate-200/90 sm:text-lg">
              Collaborative committees and faculty mentors empower every IEEE BUBT SB chapter and affinity group. Browse each team to meet
              the advisors and student leaders driving their initiatives.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/leadership"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/15"
              >
                View Main Branch Leadership
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 transition hover:-translate-y-0.5"
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
          />
          {chapterEntries.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {chapterEntries.map((chapter) => {
                const theme = getChapterTheme(chapter.slug);

                return (
                  <article
                    key={chapter.slug}
                    className="group flex flex-col gap-6 rounded-[30px] border p-8 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                    style={{
                      background: theme.cardBackground,
                      borderColor: theme.cardBorder,
                      boxShadow: theme.cardShadow
                    }}
                  >
                  <div className="space-y-2">
                    <h2 className="heading-font text-lg font-semibold text-white">{chapter.name}</h2>
                    <p className="text-xs uppercase tracking-[0.35em]" style={{ color: theme.metaColor }}>
                      {chapter.advisors.length} advisor{chapter.advisors.length === 1 ? "" : "s"} · {chapter.committee.length} committee member
                      {chapter.committee.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="space-y-3 text-sm" style={{ color: theme.secondaryTextColor }}>
                    {chapter.advisors.slice(0, 2).map((member) => (
                      <div
                        key={`${chapter.slug}-${member._id}`}
                        className="flex flex-col rounded-2xl border px-3 py-2"
                        style={{
                          background: theme.pillBackground,
                          borderColor: theme.pillBorder
                        }}
                      >
                        <span className="heading-font text-sm font-semibold text-white">{member.name}</span>
                        <span className="text-[11px] uppercase tracking-[0.32em]" style={{ color: theme.accentTextColor }}>
                          {member.role}
                        </span>
                      </div>
                    ))}
                    {chapter.committee.slice(0, 2).map((member) => (
                      <div
                        key={`${chapter.slug}-${member._id}`}
                        className="flex flex-col rounded-2xl border px-3 py-2"
                        style={{
                          background: theme.pillBackground,
                          borderColor: theme.pillBorder
                        }}
                      >
                        <span className="heading-font text-sm font-semibold text-white">{member.name}</span>
                        <span className="text-[11px] uppercase tracking-[0.32em]" style={{ color: theme.metaColor }}>
                          {member.role}
                        </span>
                      </div>
                    ))}
                    {chapter.advisors.length + chapter.committee.length > 4 ? (
                      <p className="text-xs" style={{ color: theme.metaColor }}>
                        {chapter.advisors.length + chapter.committee.length - 4} additional member
                        {chapter.advisors.length + chapter.committee.length - 4 === 1 ? "" : "s"} featured on the chapter page.
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href={`/chapters/${chapter.slug}`}
                    className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition hover:-translate-y-0.5"
                    style={{
                      borderColor: theme.buttonBorder,
                      background: theme.buttonBackground,
                      color: theme.buttonTextColor
                    }}
                  >
                    View Chapter Leadership →
                  </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-[30px] border border-white/12 bg-white/6 p-8 text-sm text-white/80">
              Add chapter or affinity group members in the admin dashboard to populate this directory.
            </p>
          )}
          {unnamedChapterCount > 0 ? (
            <p className="text-xs text-amber-200/90">
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
