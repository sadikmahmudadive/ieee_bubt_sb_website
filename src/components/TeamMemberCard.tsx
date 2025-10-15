import Image from "next/image";

import type { TeamMemberSummary } from "@/lib/actions";

type TeamMemberCardProps = {
  member: TeamMemberSummary;
};

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article className="group relative flex flex-col items-center rounded-3xl border border-white/15 bg-slate-950/70 p-8 text-center shadow-[0_30px_60px_-40px_rgba(15,23,42,0.85)] backdrop-blur transition hover:-translate-y-1 hover:border-white/30">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden />
      <div className="relative flex w-full flex-col items-center">
        <div className="relative h-28 w-28 overflow-hidden rounded-3xl border border-white/20 bg-slate-950/60 shadow-inner-card">
          <Image src={member.photoUrl} alt={member.name} fill className="object-cover" sizes="112px" />
        </div>
        <h3 className="heading-font mt-6 text-xl font-semibold text-white">{member.name}</h3>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">{member.role}</p>
        {member.bio ? <p className="mt-4 text-sm text-slate-200">{member.bio}</p> : null}
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-slate-200">
          {member.socials?.facebook ? (
            <a
              href={member.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-3 py-1 transition hover:border-white hover:text-white"
            >
              Facebook
            </a>
          ) : null}
          {member.socials?.linkedin ? (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-3 py-1 transition hover:border-white hover:text-white"
            >
              LinkedIn
            </a>
          ) : null}
          {member.socials?.email ? (
            <a
              href={`mailto:${member.socials.email}`}
              className="rounded-full border border-white/15 px-3 py-1 transition hover:border-white hover:text-white"
            >
              Email
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
