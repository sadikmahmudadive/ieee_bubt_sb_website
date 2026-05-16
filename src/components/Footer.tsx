import { siteMetadata } from "@/utils/siteMetadata";

const socialLinks = [
  { name: "Facebook", href: siteMetadata.social.facebook },
  { name: "Instagram", href: siteMetadata.social.instagram },
  { name: "LinkedIn", href: siteMetadata.social.linkedin }
];

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 border-t-4 border-primary py-12 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="space-y-4">
          <div className="text-xl font-bold text-white">
            {siteMetadata.title}
          </div>
          <p className="max-w-md text-sm text-slate-400">{siteMetadata.description}</p>
          <div className="space-y-1 text-sm text-slate-400">
            <p>{siteMetadata.contact.address}</p>
            <p>{siteMetadata.contact.phone}</p>
            <a className="inline-block text-primary-light transition hover:text-white" href={`mailto:${siteMetadata.social.email}`}>
              {siteMetadata.social.email}
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase text-white">Connect</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-400">
            {socialLinks
              .filter((item) => Boolean(item.href))
              .map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noreferrer" className="transition hover:text-primary-light">
                    {item.name}
                  </a>
                </li>
              ))}
            <li>
              <a href="/research-journals" className="transition hover:text-primary-light">
                Research & Journals
              </a>
            </li>
            <li>
              <a href="/chapters" className="transition hover:text-primary-light">
                Chapters & Affinity Groups
              </a>
            </li>
            <li>
              <a href="/admin/login" className="transition hover:text-primary-light">
                Admin Login
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-700 px-6 py-6 text-xs text-slate-400 sm:flex-row lg:px-8">
        <p>© {new Date().getFullYear()} {siteMetadata.shortTitle}. All rights reserved.</p>
        <p>A Student Branch of IEEE.</p>
      </div>
    </footer>
  );
}
