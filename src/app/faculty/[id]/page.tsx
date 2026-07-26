import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getTeamMemberById } from "@/lib/actions";
import { advisorRoleOrder, chapterAdvisorRoleOrder, resolveRoleKey } from "@/utils/teamGrouping";
import { slugify } from "@/utils/slugify";
import { siteMetadata } from "@/utils/siteMetadata";

type FacultyProfilePageProps = { params: { id: string } };

function isFacultyMember(member: NonNullable<Awaited<ReturnType<typeof getTeamMemberById>>>) {
  const roleKey = resolveRoleKey(member);
  return advisorRoleOrder.includes(roleKey) || chapterAdvisorRoleOrder.includes(roleKey);
}

export async function generateMetadata({ params }: FacultyProfilePageProps): Promise<Metadata> {
  const member = await getTeamMemberById(params.id);
  if (!member || !isFacultyMember(member)) {
    return { title: `Faculty Profile | ${siteMetadata.shortTitle}` };
  }
  return {
    title: `${member.name} | ${siteMetadata.shortTitle}`,
    description: member.bio || `${member.name}, ${member.role} at IEEE BUBT Student Branch.`,
    openGraph: member.photoUrl ? { images: [{ url: member.photoUrl, alt: member.name }] } : undefined
  };
}

export const revalidate = 0;

export default async function FacultyProfilePage({ params }: FacultyProfilePageProps) {
  const member = await getTeamMemberById(params.id);
  if (!member || !isFacultyMember(member)) {
    notFound();
  }

  const backHref = member.affiliation === "chapter" && member.chapter
    ? `/chapters/${slugify(member.chapter)}`
    : "/leadership";
  const backLabel = member.affiliation === "chapter" ? "Back to Chapter Leadership" : "Back to Leadership";
  const socialLinks = [
    member.socials.linkedin ? { label: "LinkedIn", href: member.socials.linkedin, Icon: FaLinkedin } : null,
    member.socials.facebook ? { label: "Facebook", href: member.socials.facebook, Icon: FaFacebook } : null,
    member.socials.instagram ? { label: "Instagram", href: member.socials.instagram, Icon: FaInstagram } : null,
    member.socials.email ? { label: "Email", href: `mailto:${member.socials.email}`, Icon: FaEnvelope } : null
  ].filter(Boolean) as Array<{ label: string; href: string; Icon: typeof FaLinkedin }>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="pb-24">
        <section className="relative isolate overflow-hidden bg-primary-navy py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,174,239,0.25),transparent_38%)]" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
            <Link href={backHref} className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-soft hover:text-white">← {backLabel}</Link>
          </div>
        </section>

        <section className="relative mx-auto -mt-14 max-w-6xl px-6 sm:px-8">
          <article className="grid overflow-hidden border border-slate-200 bg-white shadow-xl lg:grid-cols-[380px_1fr]">
            <div className="relative min-h-[420px] bg-slate-100 lg:min-h-[560px]">
              <Image src={member.photoUrl} alt={member.name} fill priority sizes="(max-width: 1024px) 100vw, 380px" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Faculty Profile</p>
              <h1 className="heading-font mt-5 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">{member.name}</h1>
              <p className="mt-4 text-lg font-semibold text-primary">{member.role}</p>

              <dl className="mt-8 grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-2">
                <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Affiliation</dt><dd className="mt-2 text-sm font-medium text-slate-900">{member.chapter || "IEEE BUBT Student Branch"}</dd></div>
                {member.tenure ? <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tenure</dt><dd className="mt-2 text-sm font-medium text-slate-900">{member.tenure}</dd></div> : null}
              </dl>

              <div className="mt-8">
                <h2 className="heading-font text-xl font-semibold text-slate-900">About</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">{member.bio || "Faculty profile information will be updated soon."}</p>
              </div>

              {socialLinks.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel={label === "Email" ? undefined : "noreferrer"} className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:bg-primary hover:text-white">
                      <Icon className="h-4 w-4" /> {label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
