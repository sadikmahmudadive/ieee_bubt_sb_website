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
  const photoInnerRound = isFaculty ? "rounded-[24px]" : "rounded-[20px]";
  const photoBorderRound = isFaculty ? "rounded-[28px]" : "rounded-[24px]";
  const textWidthClasses = isFaculty ? "max-w-[340px]" : "max-w-[270px]";
  const nameSizeClasses = isFaculty ? "text-[2.1rem]" : "text-[1.9rem]";

  return (
    <article
      className={`group relative flex w-full flex-col overflow-hidden rounded-[32px] border border-white/15 bg-gradient-to-br from-white/8 via-white/6 to-white/4 text-white backdrop-blur-xl transition-all duration-500 hover:border-white/25 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10 ${cardSizeClasses}`}
    >
      <div className="relative flex flex-1 flex-col items-center px-8 pb-16 pt-12">
        <div
          className={`${photoFrameClasses} overflow-hidden ${photoBorderRound} border-2 border-white/20 bg-gradient-to-br from-white/15 to-white/5 px-[3px] pb-[3px] pt-[3px] shadow-lg`}
        >
          <div className={`relative h-full w-full overflow-hidden ${photoInnerRound} border border-white/10 bg-white shadow-inner`}>
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              priority={false}
              sizes="(max-width: 768px) 90vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </div>

        <div className={`mt-8 w-full text-center ${textWidthClasses}`}>
          <h3 className={`heading-font ${nameSizeClasses} font-bold tracking-[0.01em] text-white transition-colors duration-300 group-hover:text-white/95`}>{member.name}</h3>
          <div className="mt-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80 border border-white/20">
            {member.role}
          </div>
          {member.bio ? <p className="mt-6 text-sm leading-relaxed text-white/80 transition-colors duration-300 group-hover:text-white/90">{member.bio}</p> : null}

          {socialLinks.length > 0 ? (
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    target={social.key === "email" ? undefined : "_blank"}
                    rel={social.key === "email" ? undefined : "noreferrer"}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/90 transition-all duration-300 hover:border-white/40 hover:bg-white/15 hover:text-white hover:scale-105 hover:shadow-lg"
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
