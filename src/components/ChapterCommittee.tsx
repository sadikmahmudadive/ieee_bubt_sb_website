"use client";

import { useMemo, useState } from "react";

import { Reveal, RevealList } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import type { TeamMemberSummary } from "@/lib/actions";
import { chapterStudentRoleOrder, sortByRoleOrder } from "@/utils/teamGrouping";

type ChapterCommitteeProps = {
  advisors: TeamMemberSummary[];
  committee: TeamMemberSummary[];
  currentYear: string;
};

export function ChapterCommittee({ advisors, committee, currentYear }: ChapterCommitteeProps) {
  const currentCommittee = useMemo(
    () => committee
      .filter((member) => !member.tenure || member.tenure === currentYear)
      .sort(sortByRoleOrder(chapterStudentRoleOrder)),
    [committee, currentYear]
  );
  const previousCommittee = useMemo(
    () => committee
      .filter((member) => Boolean(member.tenure) && member.tenure !== currentYear)
      .sort((a, b) => (b.tenure ?? "").localeCompare(a.tenure ?? "") || sortByRoleOrder(chapterStudentRoleOrder)(a, b)),
    [committee, currentYear]
  );
  const previousYears = useMemo(
    () => Array.from(new Set(previousCommittee.map((member) => member.tenure).filter(Boolean) as string[])).sort((a, b) => b.localeCompare(a)),
    [previousCommittee]
  );
  const [selectedYear, setSelectedYear] = useState(previousYears[0] ?? "");
  const selectedPreviousCommittee = previousCommittee.filter((member) => member.tenure === selectedYear);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 sm:px-8">
      <section className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Faculty Mentors"
            title="Advisors and counselors guiding chapter strategy"
            subtitle="Faculty mentors provide the same strategic support and continuity as the main Student Branch advisory team."
            tone="light"
          />
        </Reveal>
        {advisors.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <RevealList interval={0.1}>
              {advisors.map((member) => <TeamMemberCard key={member._id} member={member} variant="faculty" />)}
            </RevealList>
          </div>
        ) : (
          <p className="border border-slate-200 bg-slate-50 p-8 text-sm text-slate-500 shadow-sm">Add chapter advisors in the admin dashboard to highlight them here.</p>
        )}
      </section>

      <section className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow={`Executive Committee · ${currentYear}`}
            title="Student officers leading chapter operations"
            subtitle="Chair, vice chair, secretary, joint secretary, treasurer, webmaster, and committee members are ordered using the main branch structure."
            tone="light"
          />
        </Reveal>
        {currentCommittee.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <RevealList interval={0.1}>
              {currentCommittee.map((member) => <TeamMemberCard key={member._id} member={member} />)}
            </RevealList>
          </div>
        ) : (
          <p className="border border-slate-200 bg-slate-50 p-8 text-sm text-slate-500 shadow-sm">Add chapter officers with tenure {currentYear} in the admin dashboard.</p>
        )}
      </section>

      {previousCommittee.length > 0 ? (
        <section className="flex flex-col gap-10">
          <Reveal>
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Leadership Archive</p>
                <h2 className="heading-font mt-3 text-3xl font-semibold text-slate-900">Previous Executive Committee</h2>
              </div>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                Committee year
                <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="border border-slate-300 bg-white px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  {previousYears.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
            </div>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <RevealList key={selectedYear} interval={0.1}>
              {selectedPreviousCommittee.map((member) => <TeamMemberCard key={member._id} member={member} showTenure />)}
            </RevealList>
          </div>
        </section>
      ) : null}
    </div>
  );
}
