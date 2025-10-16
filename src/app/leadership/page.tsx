import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { CallToAction } from "@/components/CallToAction";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { getTeamMembers } from "@/lib/actions";
import type { TeamMemberSummary } from "@/lib/actions";
import { siteMetadata } from "@/utils/siteMetadata";
import { getChapterTheme } from "@/utils/chapterThemes";
import {
  advisorRoleOrder,
  chapterAdvisorRoleOrder,
  groupChapterMembers,
  resolveRoleKey,
  sortByPriority,
  sortByRoleOrder,
  studentRoleOrder
} from "@/utils/teamGrouping";

export const metadata: Metadata = {
  title: `Leadership | ${siteMetadata.title}`,
  description:
    "Discover the IEEE BUBT Student Branch leadership structure, featuring faculty advisors, student executive committees, and chapter teams."
};

export const revalidate = 0;

export default async function LeadershipPage() {
  let members: TeamMemberSummary[] = [];

  if (process.env.MONGODB_URI) {
    members = await getTeamMembers();
  }

  const mainMembers = members.filter((member) => (member.affiliation ?? "main") === "main");
  const chapterMembers = members.filter((member) => (member.affiliation ?? "main") === "chapter");

  const mainAdvisors = mainMembers
    .filter((member) => advisorRoleOrder.includes(resolveRoleKey(member)))
    .sort(sortByRoleOrder(advisorRoleOrder));
  const mainStudents = mainMembers
    .filter((member) => studentRoleOrder.includes(resolveRoleKey(member)))
    .sort(sortByRoleOrder(studentRoleOrder));
  const mainCommittees = mainMembers.filter((member) => {
    const key = resolveRoleKey(member);
    return !advisorRoleOrder.includes(key) && !studentRoleOrder.includes(key);
  });
  const chapterEntries = groupChapterMembers(chapterMembers);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="space-y-24 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/5 py-24 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-950 to-slate-950" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-primary/60 via-white/10 to-transparent blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Leadership</p>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-[2.75rem]">The people powering IEEE BUBT SB</h1>
            <p className="mt-6 text-base text-slate-200/90 sm:text-lg">
              A collaborative network of faculty mentors and student officers guides every initiative. Explore the main branch leadership
              and meet the teams advancing each IEEE chapter at BUBT.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/#team"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/15"
              >
                View Homepage Highlights
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 transition hover:-translate-y-0.5"
              >
                Connect with the Branch
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
          <SectionHeading
            eyebrow="Main Branch"
            title="Faculty and student leaders at IEEE BUBT SB"
            subtitle="Advisors, counselors, and the executive committee ensure continuity between academia, industry, and student-led innovation."
          />
          <div className="space-y-14">
            <div>
              <h2 className="heading-font text-lg font-semibold text-white">Faculty Advisors & Counselor</h2>
              <p className="mt-2 text-sm text-slate-300">Chief advisor, executive advisors, advisor, and branch counselor.</p>
              <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {mainAdvisors.length > 0 ? (
                  mainAdvisors.map((member) => <TeamMemberCard key={member._id} member={member} />)
                ) : (
                  <p className="col-span-full rounded-[30px] border border-white/12 bg-white/6 p-8 text-center text-sm text-white/80">
                    Add faculty advisors in the admin dashboard to showcase them here.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="heading-font text-lg font-semibold text-white">Student Executive Committee</h2>
              <p className="mt-2 text-sm text-slate-300">Chairperson, vice chairperson, general secretaries, treasurer, and webmaster.</p>
              <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {mainStudents.length > 0 ? (
                  mainStudents.map((member) => <TeamMemberCard key={member._id} member={member} />)
                ) : (
                  <p className="col-span-full rounded-[30px] border border-white/12 bg-white/6 p-8 text-center text-sm text-white/80">
                    Assign homepage spotlight roles in the admin dashboard to populate this section.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="heading-font text-lg font-semibold text-white">Committee & Operations Leads</h2>
              <p className="mt-2 text-sm text-slate-300">Directors, coordinators, and specialized teams supporting branch programs.</p>
              <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {mainCommittees.length > 0 ? (
                  sortByPriority(mainCommittees).map((member) => <TeamMemberCard key={member._id} member={member} />)
                ) : (
                  <p className="col-span-full rounded-[30px] border border-white/12 bg-white/6 p-8 text-center text-sm text-white/80">
                    Add committee leads to the main branch roster to display them here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {chapterEntries.length > 0 ? (
          <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
            <SectionHeading
              eyebrow="Student Branch Chapters"
              title="Chapters and affinity groups extending IEEE at BUBT"
              subtitle="Each chapter is guided by faculty advisors and student committees delivering specialized programs."
            />
            <div className="space-y-16">
              {chapterEntries.map((chapter) => {
                const theme = getChapterTheme(chapter.slug);

                return (
                  <div
                    key={chapter.name}
                    className="space-y-10 rounded-[32px] border p-8 backdrop-blur"
                    style={{
                      background: theme.panelBackground,
                      borderColor: theme.panelBorder,
                      boxShadow: theme.panelShadow
                    }}
                  >
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="heading-font text-xl font-semibold text-white">{chapter.name}</h2>
                    <span className="text-xs uppercase tracking-[0.33em]" style={{ color: theme.metaColor }}>
                      Faculty mentors and chapter committee
                    </span>
                  </div>
                  <div className="space-y-12">
                    <div>
                      <h3
                        className="text-sm font-semibold uppercase tracking-[0.35em]"
                        style={{ color: theme.accentTextColor }}
                      >
                        Advisors & Counselors
                      </h3>
                      <div className="mt-4 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {chapter.advisors.length > 0 ? (
                          chapter.advisors.map((member) => <TeamMemberCard key={member._id} member={member} />)
                        ) : (
                          <p
                            className="col-span-full rounded-[28px] border p-6 text-center text-sm"
                            style={{
                              background: theme.cardBackground,
                              borderColor: theme.cardBorder,
                              boxShadow: theme.cardShadow,
                              color: theme.metaColor
                            }}
                          >
                            Add chapter advisors in the admin dashboard to highlight them here.
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3
                        className="text-sm font-semibold uppercase tracking-[0.35em]"
                        style={{ color: theme.accentTextColor }}
                      >
                        Chapter Committee
                      </h3>
                      <div className="mt-4 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {chapter.committee.length > 0 ? (
                          chapter.committee.map((member) => <TeamMemberCard key={member._id} member={member} />)
                        ) : (
                          <p
                            className="col-span-full rounded-[28px] border p-6 text-center text-sm"
                            style={{
                              background: theme.cardBackground,
                              borderColor: theme.cardBorder,
                              boxShadow: theme.cardShadow,
                              color: theme.metaColor
                            }}
                          >
                            Committee members will appear once added to this chapter.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
