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

  const cardSizeClasses = isFaculty ? "min-h-[520px] max-w-[420px]" : "min-h-[460px] max-w-[320px]";
  const photoFrameClasses = isFaculty
    ? "relative h-[240px] w-full max-w-[320px]"
    : "relative h-[200px] w-full max-w-[250px]";
  const photoInnerRound = isFaculty ? "rounded-[22px]" : "rounded-[18px]";
  const photoBorderRound = isFaculty ? "rounded-[26px]" : "rounded-[22px]";
  const textWidthClasses = isFaculty ? "max-w-[340px]" : "max-w-[270px]";
  const nameSizeClasses = isFaculty ? "text-[2rem]" : "text-[1.8rem]";

  return (
    <article
      className={`group relative flex w-full flex-col overflow-hidden rounded-[28px] border border-white/12 bg-white/6 text-white backdrop-blur transition duration-300 hover:border-white/20 hover:-translate-y-1 ${cardSizeClasses}`}
    >
      <div className="relative flex flex-1 flex-col items-center px-8 pb-14 pt-10">
        <div
          className={`${photoFrameClasses} overflow-hidden ${photoBorderRound} border border-white/20 bg-white/10 px-[2px] pb-[2px] pt-[2px]`}
        >
          <div className={`relative h-full w-full overflow-hidden ${photoInnerRound} border border-white/10 bg-white`}>
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
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60">{member.role}</p>
          {member.bio ? <p className="mt-5 text-sm leading-relaxed text-white/75">{member.bio}</p> : null}

          {socialLinks.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target={social.key === "email" ? undefined : "_blank"}
                  rel={social.key === "email" ? undefined : "noreferrer"}
                  className="inline-flex items-center rounded-full border border-white/18 bg-white/12 px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white transition hover:border-primary-light hover:bg-primary-light/15 hover:text-primary-light"
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
