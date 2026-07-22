"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, RevealList } from "@/components/Reveal";
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
  currentYear: string;
};

export function TeamGrid({ team, currentYear }: TeamGridProps) {
  const chapterExclusiveRoleKeys = new Set([
    ...chapterAdvisorRoleOrder.filter((role) => role.startsWith("chapter-")),
    "chapter-chair",
    "chapter-vice-chair",
    "chapter-secretary",
    "chapter-joint-secretary",
    "chapter-treasurer",
    "chapter-webmaster",
    "chapter-committee"
  ]);

  const mainTeam = team.filter((member) => {
    const affiliation = member.affiliation ?? "main";
    const roleKey = resolveRoleKey(member);
    if (affiliation === "chapter") {
      return false;
    }
    if (chapterExclusiveRoleKeys.has(roleKey)) {
      return false;
    }
    return true;
  });
  const advisorSpotlight = mainTeam
    .filter((member) => advisorRoleOrder.includes(resolveRoleKey(member)))
    .sort(sortByRoleOrder(advisorRoleOrder));
  const currentStudents = mainTeam
    .filter((member) => studentRoleOrder.includes(resolveRoleKey(member)) && (!member.tenure || member.tenure === currentYear))
    .sort(sortByRoleOrder(studentRoleOrder));
    
  const previousStudents = mainTeam
    .filter((member) => studentRoleOrder.includes(resolveRoleKey(member)) && member.tenure && member.tenure !== currentYear)
    .sort((a, b) => {
      if (a.tenure !== b.tenure) {
        return (b.tenure || "").localeCompare(a.tenure || ""); // Sort by tenure descending (newest first)
      }
      return sortByRoleOrder(studentRoleOrder)(a, b);
    });

  const uniqueYears = Array.from(new Set(previousStudents.map((m) => m.tenure || "")))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));
  
  const [selectedYear, setSelectedYear] = useState<string>(uniqueYears[0] || "");
  const displayedPreviousStudents = previousStudents.filter((m) => m.tenure === selectedYear);

  return (
    <section id="team" className="relative py-24 border-t border-slate-200">
      <div className="absolute inset-0 -z-10 bg-slate-50" aria-hidden />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Main Branch Leadership"
            title="Guided by Faculty Mentors and Student Officers"
            subtitle="Meet the advisors and executive student team steering IEEE BUBT SB. Visit the leadership and chapter hubs to explore the complete organization."
            tone="light"
          />
        </Reveal>
        <div className="mt-16 space-y-14">
          <div>
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
                <h3 className="heading-font text-lg font-semibold text-slate-900">Faculty Advisors</h3>
                <p className="text-xs uppercase tracking-wider text-slate-500">Chief advisor, executive advisors, advisor, and counselor</p>
              </div>
            </Reveal>
            <div className="mt-8 grid justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {advisorSpotlight.length > 0 ? (
                <RevealList interval={0.15}>
                  {advisorSpotlight.map((member) => <TeamMemberCard key={member._id} member={member} variant="faculty" />)}
                </RevealList>
              ) : (
                <Reveal>
                  <p className="col-span-full rounded-none border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    Add faculty advisors via the admin panel to highlight them here.
                  </p>
                </Reveal>
              )}
            </div>
          </div>
          <div>
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
                <h3 className="heading-font text-lg font-semibold text-slate-900">Student Executive Committee - {currentYear}</h3>
                <p className="text-xs uppercase tracking-wider text-slate-500">Chair, vice chair, secretary, joint secretary, treasurer, and web master</p>
              </div>
            </Reveal>
            <div className="mt-8 grid justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {currentStudents.length > 0 ? (
                <RevealList interval={0.15} delay={0.2}>
                  {currentStudents.map((member) => <TeamMemberCard key={member._id} member={member} />)}
                </RevealList>
              ) : (
                <Reveal>
                  <p className="col-span-full rounded-none border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    Add student leaders with the homepage spotlight role to feature them here.
                  </p>
                </Reveal>
              )}
            </div>
          </div>
          {previousStudents.length > 0 && (
            <div>
              <Reveal>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="heading-font text-lg font-semibold text-slate-900">Previous Executive Committee</h3>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">Honoring our past student leaders</p>
                  </div>
                  {uniqueYears.length > 0 && (
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {uniqueYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  )}
                </div>
              </Reveal>
              <div className="mt-8 grid justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-3 opacity-90">
                <RevealList interval={0.15} delay={0.2} key={selectedYear}>
                  {displayedPreviousStudents.map((member) => <TeamMemberCard key={member._id} member={member} showTenure={true} />)}
                </RevealList>
              </div>
            </div>
          )}
        </div>
        <Reveal y={10} delay={0.4}>
          <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/leadership"
              className="inline-flex items-center justify-center min-w-[240px] rounded-none border border-primary bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-primary-dark"
            >
              Explore Full Leadership →
            </Link>
            <Link
              href="/chapters"
              className="inline-flex items-center justify-center min-w-[240px] rounded-none border border-slate-300 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Browse Chapters →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
