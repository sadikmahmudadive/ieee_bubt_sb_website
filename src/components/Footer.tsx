import { siteMetadata } from "@/utils/siteMetadata";

const socialLinks = [
  { name: "Facebook", href: siteMetadata.social.facebook },
  { name: "Instagram", href: siteMetadata.social.instagram },
  { name: "LinkedIn", href: siteMetadata.social.linkedin }
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 py-12 text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="heading-font text-sm font-semibold uppercase tracking-[0.4em] text-primary-light/90">
            {siteMetadata.shortTitle}
          </div>
          <p className="max-w-md text-sm text-white/65">{siteMetadata.description}</p>
          <div className="space-y-2 text-sm text-white/55">
            <p>{siteMetadata.contact.address}</p>
            <p>{siteMetadata.contact.phone}</p>
            <a className="inline-block text-primary-light/90 transition hover:text-white" href={`mailto:${siteMetadata.social.email}`}>
              {siteMetadata.social.email}
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Connect</h4>
          <ul className="flex flex-wrap gap-4 text-sm text-white/65">
            {socialLinks
              .filter((item) => Boolean(item.href))
              .map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noreferrer" className="transition hover:text-white">
                    {item.name}
                  </a>
                </li>
              ))}
            <li>
              <a href="/research-journals" className="transition hover:text-white">
                Research & Journals
              </a>
            </li>
            <li>
              <a href="/chapters" className="transition hover:text-white">
                Chapters & Affinity Groups
              </a>
            </li>
            <li>
              <a href="/admin/login" className="transition hover:text-white">
                Admin Login
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
        <p>© {new Date().getFullYear()} {siteMetadata.title}. All rights reserved.</p>
        <p>Crafted for the IEEE BUBT Student Branch community.</p>
      </div>
    </footer>
  );
}
