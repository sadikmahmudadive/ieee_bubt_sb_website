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
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="space-y-24 pb-24">
        <section className="relative isolate overflow-hidden border-b border-slate-200 py-24 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-blue-100/50 via-transparent to-transparent" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Leadership</p>
            <h1 className="mt-6 text-4xl font-bold text-slate-900 sm:text-[2.75rem]">The people powering IEEE BUBT SB</h1>
            <p className="mt-6 text-base text-slate-600 sm:text-lg">
              A collaborative network of faculty mentors and student officers guides every initiative. Explore the main branch leadership
              and meet the teams advancing each IEEE chapter at BUBT.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/#team"
                className="inline-flex items-center justify-center rounded-none border border-primary bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-primary-dark hover:border-primary-dark"
              >
                View Homepage Highlights
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-none border-2 border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-700 transition hover:border-primary hover:text-primary hover:bg-slate-50"
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
            tone="light"
          />
          <div className="space-y-14">
            <div>
              <h2 className="heading-font text-lg font-semibold text-slate-900 border-b border-slate-200 pb-3">Faculty Advisors & Counselor</h2>
              <p className="mt-4 text-sm text-slate-600">Chief advisor, executive advisors, advisor, and branch counselor.</p>
              <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {mainAdvisors.length > 0 ? (
                  mainAdvisors.map((member) => <TeamMemberCard key={member._id} member={member} />)
                ) : (
                  <p className="col-span-full rounded-none border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 shadow-sm">
                    Add faculty advisors in the admin dashboard to showcase them here.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-8">
              <h2 className="heading-font text-lg font-semibold text-slate-900 border-b border-slate-200 pb-3">Student Executive Committee</h2>
              <p className="mt-4 text-sm text-slate-600">Chairperson, vice chairperson, general secretaries, treasurer, and webmaster.</p>
              <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {mainStudents.length > 0 ? (
                  mainStudents.map((member) => <TeamMemberCard key={member._id} member={member} />)
                ) : (
                  <p className="col-span-full rounded-none border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 shadow-sm">
                    Assign homepage spotlight roles in the admin dashboard to populate this section.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-8">
              <h2 className="heading-font text-lg font-semibold text-slate-900 border-b border-slate-200 pb-3">Committee & Operations Leads</h2>
              <p className="mt-4 text-sm text-slate-600">Directors, coordinators, and specialized teams supporting branch programs.</p>
              <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {mainCommittees.length > 0 ? (
                  sortByPriority(mainCommittees).map((member) => <TeamMemberCard key={member._id} member={member} />)
                ) : (
                  <p className="col-span-full rounded-none border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 shadow-sm">
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
              tone="light"
            />
            <div className="space-y-16">
              {chapterEntries.map((chapter) => {
                const theme = getChapterTheme(chapter.slug);

                return (
                  <div
                    key={chapter.name}
                    className="space-y-10 border border-slate-200 bg-white p-8 shadow-sm"
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
