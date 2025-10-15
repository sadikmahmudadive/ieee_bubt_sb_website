import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import type { TeamMemberSummary } from "@/lib/actions";
import {
  advisorRoleOrder,
  chapterAdvisorRoleOrder,
  resolveRoleKey,
  sortByRoleOrder,
  studentRoleOrder
} from "@/utils/teamGrouping";
import { TeamMemberCard } from "@/components/TeamMemberCard";

type TeamGridProps = {
  team: TeamMemberSummary[];
};

export function TeamGrid({ team }: TeamGridProps) {
  const chapterRoleKeys = new Set([...chapterAdvisorRoleOrder, "chapter-chair", "chapter-vice-chair", "chapter-secretary", "chapter-joint-secretary", "chapter-treasurer", "chapter-webmaster", "chapter-committee"]);

  const mainTeam = team.filter((member) => {
    const affiliation = member.affiliation ?? "main";
    if (affiliation === "chapter") {
      return false;
    }
    const roleKey = resolveRoleKey(member);
    if (chapterRoleKeys.has(roleKey)) {
      return false;
    }
    return true;
  });
  const advisorSpotlight = mainTeam
    .filter((member) => advisorRoleOrder.includes(resolveRoleKey(member)))
    .sort(sortByRoleOrder(advisorRoleOrder));
  const studentSpotlight = mainTeam
    .filter((member) => studentRoleOrder.includes(resolveRoleKey(member)))
    .sort(sortByRoleOrder(studentRoleOrder));

  return (
    <section id="team" className="relative py-28">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900/40 via-transparent to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Main Branch Leadership"
          title="Guided by Faculty Mentors and Student Officers"
          subtitle="Meet the advisors and executive student team steering IEEE BUBT SB. Visit the leadership and chapter hubs to explore the complete organization."
        />
        <div className="mt-16 space-y-16">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="heading-font text-lg font-semibold text-white">Faculty Advisors</h3>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Chief advisor, executive advisors, advisor, and counselor</p>
            </div>
            <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {advisorSpotlight.length > 0 ? (
                advisorSpotlight.map((member) => <TeamMemberCard key={member._id} member={member} />)
              ) : (
                <p className="col-span-full rounded-3xl border border-white/15 bg-slate-950/70 p-8 text-center text-sm text-slate-200">
                  Add faculty advisors via the admin panel to highlight them here.
                </p>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="heading-font text-lg font-semibold text-white">Student Executive Committee</h3>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Chairperson, vice chairperson, GS, JGS, treasurer, and web master</p>
            </div>
            <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {studentSpotlight.length > 0 ? (
                studentSpotlight.map((member) => <TeamMemberCard key={member._id} member={member} />)
              ) : (
                <p className="col-span-full rounded-3xl border border-white/15 bg-slate-950/70 p-8 text-center text-sm text-slate-200">
                  Add student leaders with the homepage spotlight role to feature them here.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/leadership"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/10"
          >
            Explore Full Leadership →
          </Link>
          <Link
            href="/chapters"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/10"
          >
            Browse Chapters & Affinity Groups →
          </Link>
        </div>
      </div>
    </section>
  );
}
