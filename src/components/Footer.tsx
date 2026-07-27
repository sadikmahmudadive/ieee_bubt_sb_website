import Link from "next/link";
import { siteMetadata } from "@/utils/siteMetadata";
import { FaLinkedin, FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Activities", href: "/#events" },
  { label: "Leadership", href: "/leadership" },
  { label: "Chapters", href: "/chapters" },
  { label: "News", href: "/news" },
  { label: "Research & Journals", href: "/research-journals" },
  { label: "Apply", href: "/apply" }
];

const socialIcons = [
  { name: "LinkedIn", href: siteMetadata.social.linkedin, Icon: FaLinkedin },
  { name: "Facebook", href: siteMetadata.social.facebook, Icon: FaFacebook },
  { name: "Instagram", href: siteMetadata.social.instagram, Icon: FaInstagram },
  { name: "Email", href: `mailto:${siteMetadata.social.email}`, Icon: FaEnvelope }
];

export function Footer() {
  return (
    <footer id="contact" className="relative bg-primary-navy text-slate-400">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-light/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div className="space-y-4 sm:space-y-5 sm:col-span-2 lg:col-span-1">
            <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {siteMetadata.shortTitle}
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              {siteMetadata.description}
            </p>
            <div className="space-y-1 sm:space-y-1.5 text-sm">
              <p className="text-slate-400">{siteMetadata.contact.address}</p>
              <p className="text-slate-400">{siteMetadata.contact.phone}</p>
              <a className="inline-block text-primary-light transition hover:text-white break-all" href={`mailto:${siteMetadata.social.email}`}>
                {siteMetadata.social.email}
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
              {socialIcons
                .filter((item) => Boolean(item.href))
                .map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.name === "Email" ? undefined : "_blank"}
                    rel={item.name === "Email" ? undefined : "noreferrer"}
                    aria-label={item.name}
                    className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all duration-200 hover:border-primary-light/50 hover:bg-primary/20 hover:text-primary-light"
                  >
                    <item.Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs sm:text-sm text-slate-400 transition-all duration-200 hover:text-white inline-flex items-center gap-1.5">
                    <span className="text-primary-light/60">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* IEEE info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white">About IEEE BUBT SB</h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              The IEEE BUBT Student Branch is officially recognized by the Institute of Electrical and Electronics Engineers &mdash; the world&apos;s largest technical professional organization.
            </p>
            <div className="pt-1 sm:pt-2">
              <a href="/admin/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-200">
                Admin Login
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-14 border-t border-white/10 pt-6 sm:pt-8 flex flex-col items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-600 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {siteMetadata.shortTitle}. All rights reserved.</p>
          <p>A Student Branch of the Institute of Electrical and Electronics Engineers.</p>
        </div>
      </div>
    </footer>
  );
}

