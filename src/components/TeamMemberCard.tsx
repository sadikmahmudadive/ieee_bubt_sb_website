import Image from "next/image";

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
          href: member.socials.linkedin
        }
      : null,
    member.socials?.facebook
      ? {
          key: "facebook",
          label: "Facebook",
          href: member.socials.facebook
        }
      : null,
    member.socials?.email
      ? {
          key: "email",
          label: "Email",
          href: `mailto:${member.socials.email}`
        }
      : null
  ].filter(Boolean) as Array<{ key: string; label: string; href: string }>;

  const cardSizeClasses = isFaculty ? "min-h-[560px] max-w-[420px]" : "min-h-[500px] max-w-[320px]";
  const photoFrameClasses = isFaculty
    ? "relative h-[250px] w-full max-w-[320px]"
    : "relative h-[210px] w-full max-w-[250px]";
  const photoInnerRound = isFaculty ? "rounded-[24px]" : "rounded-[20px]";
  const photoBorderRound = isFaculty ? "rounded-[28px]" : "rounded-[24px]";
  const textWidthClasses = isFaculty ? "max-w-[340px]" : "max-w-[280px]";
  const nameSizeClasses = isFaculty ? "text-[2.2rem]" : "text-[1.9rem]";

  return (
    <article
      className={`group relative flex w-full flex-col overflow-hidden rounded-[32px] border border-white/14 bg-white/10 text-white shadow-[0_52px_140px_-60px_rgba(6,20,70,0.72)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_70px_180px_-70px_rgba(12,42,120,0.6)] ${cardSizeClasses}`}
    >
      <div className="pointer-events-none absolute inset-[12px] rounded-[26px] border border-white/20" aria-hidden />

      <div className="relative flex flex-1 flex-col items-center px-8 pb-14 pt-10">
        <div
          className={`${photoFrameClasses} overflow-hidden ${photoBorderRound} border border-white/65 bg-white/15 px-[2px] pb-[2px] pt-[2px] shadow-[0_30px_68px_-36px_rgba(12,32,90,0.56)]`}
        >
          <div className={`relative h-full w-full overflow-hidden ${photoInnerRound} border border-white/45 bg-white`}>
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              priority={false}
              sizes="(max-width: 768px) 90vw, 320px"
              className="object-cover"
            />
          </div>
        </div>

        <div className={`mt-7 w-full text-center ${textWidthClasses}`}>
          <h3 className={`heading-font ${nameSizeClasses} font-semibold tracking-[0.01em] text-white`}>{member.name}</h3>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.38em] text-[#c9dbff]">{member.role}</p>
          {member.bio ? <p className="mt-5 text-sm leading-relaxed text-white/85">{member.bio}</p> : null}

          {socialLinks.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target={social.key === "email" ? undefined : "_blank"}
                  rel={social.key === "email" ? undefined : "noreferrer"}
                  className="inline-flex items-center rounded-full border border-white/55 bg-[#2b5dd4] px-7 py-2 text-[11px] font-semibold uppercase tracking-[0.36em] text-white shadow-[0_16px_35px_-20px_rgba(25,58,150,0.65)] transition hover:bg-[#204ab2]"
                >
                  {social.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
