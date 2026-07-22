import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { CallToAction } from "@/components/CallToAction";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { Reveal, RevealList } from "@/components/Reveal";
import { getTeamMembers } from "@/lib/actions";
import type { TeamMemberSummary } from "@/lib/actions";
import { siteMetadata } from "@/utils/siteMetadata";
import { getChapterTheme } from "../../utils/chapterThemes";
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

  try {
    members = await getTeamMembers();
  } catch (error) {
    console.error("Failed to load team members", error);
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="space-y-20 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/10 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-dark to-primary" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,174,239,0.18),transparent_35%)]" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
            <Reveal y={-20}>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-soft">Leadership</p>
              <h1 className="mt-6 text-4xl font-light text-white sm:text-[2.75rem]">The people powering IEEE BUBT SB</h1>
              <p className="mt-6 text-base text-white/80 sm:text-lg">
                A collaborative network of faculty mentors and student officers guides every initiative. Explore the main branch leadership
                and meet the teams advancing each IEEE chapter at BUBT.
              </p>
            </Reveal>
            <Reveal y={20} delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/#team"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-primary-dark"
                >
                  View Homepage Highlights
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-white hover:bg-white hover:text-primary"
                >
                  Connect with the Branch
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Main Branch"
              title="Faculty and student leaders at IEEE BUBT SB"
              subtitle="Advisors, counselors, and the executive committee ensure continuity between academia, industry, and student-led innovation."
              tone="light"
            />
          </Reveal>
          <div className="space-y-14">
            <div>
              <Reveal>
                <h2 className="heading-font text-lg font-semibold text-slate-900 border-b border-slate-200 pb-3">Faculty Advisors & Counselor</h2>
                <p className="mt-4 text-sm text-slate-600">Chief advisor, executive advisors, advisor, and branch counselor.</p>
              </Reveal>
              <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {mainAdvisors.length > 0 ? (
                  <RevealList interval={0.1}>
                    {mainAdvisors.map((member) => <TeamMemberCard key={member._id} member={member} />)}
                  </RevealList>
                ) : (
                  <Reveal>
                    <p className="col-span-full rounded-none border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 shadow-sm">
                      Add faculty advisors in the admin dashboard to showcase them here.
                    </p>
                  </Reveal>
                )}
              </div>
            </div>

            <div className="pt-8">
              <Reveal>
                <h2 className="heading-font text-lg font-semibold text-slate-900 border-b border-slate-200 pb-3">Student Executive Committee</h2>
                <p className="mt-4 text-sm text-slate-600">Chair, vice chair, secretary, joint secretary, treasurer, and webmaster.</p>
              </Reveal>
              <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {mainStudents.length > 0 ? (
                  <RevealList interval={0.1}>
                    {mainStudents.map((member) => <TeamMemberCard key={member._id} member={member} />)}
                  </RevealList>
                ) : (
                  <Reveal>
                    <p className="col-span-full rounded-none border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 shadow-sm">
                      Assign homepage spotlight roles in the admin dashboard to populate this section.
                    </p>
                  </Reveal>
                )}
              </div>
            </div>

            <div className="pt-8">
              <Reveal>
                <h2 className="heading-font text-lg font-semibold text-slate-900 border-b border-slate-200 pb-3">Committee & Operations Leads</h2>
                <p className="mt-4 text-sm text-slate-600">Directors, coordinators, and specialized teams supporting branch programs.</p>
              </Reveal>
              <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {mainCommittees.length > 0 ? (
                  <RevealList interval={0.1}>
                    {sortByPriority(mainCommittees).map((member) => <TeamMemberCard key={member._id} member={member} />)}
                  </RevealList>
                ) : (
                  <Reveal>
                    <p className="col-span-full rounded-none border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 shadow-sm">
                      Add committee leads to the main branch roster to display them here.
                    </p>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>

        {chapterEntries.length > 0 ? (
          <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Student Branch Chapters"
                title="Chapters and affinity groups extending IEEE at BUBT"
                subtitle="Each chapter is guided by faculty advisors and student committees delivering specialized programs."
                tone="light"
              />
            </Reveal>
            <div className="space-y-16">
              {chapterEntries.map((chapter) => {
                return (
                  <Reveal key={chapter.name} y={30}>
                    <div
                      className="space-y-10 border border-border bg-white p-8 shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
                    >
                      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-4">
                        <h2 className="heading-font text-xl font-semibold text-slate-900">{chapter.name}</h2>
                        <span className="text-xs uppercase tracking-[0.2em] text-primary">
                          Faculty mentors and chapter committee
                        </span>
                      </div>
                      <div className="space-y-12">
                        <div>
                          <h3
                            className="text-sm font-semibold uppercase tracking-wider text-slate-600"
                          >
                            Advisors & Counselors
                          </h3>
                          <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {chapter.advisors.length > 0 ? (
                              chapter.advisors.map((member) => <TeamMemberCard key={member._id} member={member} />)
                            ) : (
                              <p
                                className="col-span-full border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-500 shadow-sm"
                              >
                                Add chapter advisors in the admin dashboard to highlight them here.
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3
                            className="text-sm font-semibold uppercase tracking-wider text-slate-600"
                          >
                            Chapter Committee
                          </h3>
                          <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {chapter.committee.length > 0 ? (
                              chapter.committee.map((member) => <TeamMemberCard key={member._id} member={member} />)
                            ) : (
                              <p
                                className="col-span-full border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-500 shadow-sm"
                              >
                                Committee members will appear once added to this chapter.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
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
