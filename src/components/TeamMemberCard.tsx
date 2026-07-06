import Image from "next/image";
import { FaLinkedin, FaFacebook, FaEnvelope } from "react-icons/fa";

import type { TeamMemberSummary } from "@/lib/actions";

type TeamMemberCardProps = {
  member: TeamMemberSummary;
  variant?: "faculty" | "standard";
  showTenure?: boolean;
};

export function TeamMemberCard({ member, variant = "standard", showTenure = false }: TeamMemberCardProps) {
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

  const photoFrameClasses = isFaculty
    ? "relative h-[280px] w-full"
    : "relative h-[240px] w-full";
  const nameSizeClasses = isFaculty ? "text-[1.75rem]" : "text-[1.5rem]";

  return (
    <article
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)]"
    >
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div
          className={`${photoFrameClasses} overflow-hidden rounded-2xl bg-slate-50 relative`}
        >
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/5 pointer-events-none" />
        </div>

        <div className="mt-6 flex flex-1 flex-col text-center">
          <h3 className={`heading-font ${nameSizeClasses} font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-primary`}>
            {member.name}
          </h3>
          
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary ring-1 ring-inset ring-primary/20">
              {member.role}
            </span>
          </div>

          {showTenure && member.tenure ? (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                {member.tenure}
              </span>
            </div>
          ) : null}

          {member.bio ? (
            <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-3">
              {member.bio}
            </p>
          ) : null}

          <div className="mt-auto pt-6">
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target={social.key === "email" ? undefined : "_blank"}
                      rel={social.key === "email" ? undefined : "noreferrer"}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {social.label}
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="h-[32px]" /> // Spacer to maintain consistent height if no socials
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
