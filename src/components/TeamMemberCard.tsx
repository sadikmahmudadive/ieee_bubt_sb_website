import Image from "next/image";
import { FaLinkedin, FaFacebook, FaEnvelope } from "react-icons/fa";

import type { TeamMemberSummary } from "@/lib/actions";

type TeamMemberCardProps = {
  member: TeamMemberSummary;
  variant?: "faculty" | "standard";
};

export function TeamMemberCard({ member, variant = "standard" }: TeamMemberCardProps) {
  const isFaculty = variant === "faculty";

  const socialLinks = [
    member.socials?.linkedin
      ? {
          key: "linkedin",
          label: "LinkedIn",
          href: member.socials.linkedin,
          icon: FaLinkedin
        }
      : null,
    member.socials?.facebook
      ? {
          key: "facebook",
          label: "Facebook",
          href: member.socials.facebook,
          icon: FaFacebook
        }
      : null,
    member.socials?.email
      ? {
          key: "email",
          label: "Email",
          href: `mailto:${member.socials.email}`,
          icon: FaEnvelope
        }
      : null
  ].filter(Boolean) as Array<{ key: string; label: string; href: string; icon: React.ComponentType<{ className?: string }> }>;

  const cardSizeClasses = isFaculty ? "min-h-[540px] max-w-[420px]" : "min-h-[480px] max-w-[320px]";
  const photoFrameClasses = isFaculty
    ? "relative h-[250px] w-full max-w-[320px]"
    : "relative h-[210px] w-full max-w-[250px]";
  const photoInnerRound = isFaculty ? "rounded-[8px]" : "rounded-[8px]";
  const photoBorderRound = isFaculty ? "rounded-[12px]" : "rounded-[12px]";
  const textWidthClasses = isFaculty ? "max-w-[340px]" : "max-w-[270px]";
  const nameSizeClasses = isFaculty ? "text-[2.1rem]" : "text-[1.9rem]";

  return (
    <article
      className={`group relative flex w-full flex-col overflow-hidden rounded-none border border-slate-200 bg-white text-slate-900 shadow-md transition-all duration-300 hover:border-primary-light hover:-translate-y-1 hover:shadow-xl ${cardSizeClasses}`}
    >
      <div className="relative flex flex-1 flex-col items-center px-8 pb-10 pt-12">
        <div
          className={`${photoFrameClasses} overflow-hidden ${photoBorderRound} border border-slate-100 bg-white px-1 py-1 shadow-sm`}
        >
          <div className={`relative h-full w-full overflow-hidden ${photoInnerRound} bg-slate-100`}>
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              priority={false}
              sizes="(max-width: 768px) 90vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        <div className={`mt-8 w-full text-center ${textWidthClasses}`}>
          <h3 className={`heading-font ${nameSizeClasses} font-bold tracking-[0.01em] text-slate-900 transition-colors duration-300 group-hover:text-primary`}>{member.name}</h3>
          <div className="mt-4 inline-flex items-center rounded-sm bg-slate-100 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary border border-slate-200">
            {member.role}
          </div>
          {member.bio ? <p className="mt-4 text-sm leading-relaxed text-slate-600">{member.bio}</p> : null}

          {socialLinks.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    target={social.key === "email" ? undefined : "_blank"}
                    rel={social.key === "email" ? undefined : "noreferrer"}
                    className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600 transition-all duration-300 hover:border-primary hover:bg-slate-50 hover:text-primary hover:shadow-sm"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {social.label}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
