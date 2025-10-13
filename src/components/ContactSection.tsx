import { SectionHeading } from "@/components/SectionHeading";
import { siteMetadata } from "@/utils/siteMetadata";

export function ContactSection() {
  return (
    <section className="relative py-28">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900/40 via-transparent to-transparent" aria-hidden />
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          id="contact"
          eyebrow="Contact"
          title="Let's Collaborate"
          subtitle="Reach out to IEEE BUBT SB for partnerships, event collaborations, or student membership inquiries."
        />
        <div className="mt-16 grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[2.5rem] border border-white/15 bg-slate-950/70 p-10 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.9)] backdrop-blur">
            <div className="space-y-6">
              <h3 className="heading-font text-2xl font-semibold text-white">Let’s craft the next breakthrough together.</h3>
              <p className="text-sm text-slate-200">
                Share your partnership ideas, invite us to speak at your event, or learn how to empower your peers through IEEE
                programs.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">Email</h4>
                  <a href={`mailto:${siteMetadata.social.email}`} className="text-lg text-white transition hover:text-primary-light">
                    {siteMetadata.social.email}
                  </a>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">Phone</h4>
                  <p className="text-lg text-white/90">{siteMetadata.contact.phone}</p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">HQ</h4>
                  <p className="text-base text-slate-200">{siteMetadata.contact.address}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-slate-200">
                <p>Office Hours: Sun–Thu · 10am – 5pm (BST)</p>
                <p className="mt-1">IEEE Room, 5th Floor, BUBT Permanent Campus</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-white/15 bg-slate-950/70 p-8 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.9)] backdrop-blur">
            <h3 className="heading-font text-lg font-semibold text-white">Stay Updated</h3>
            <p className="mt-3 text-sm text-slate-200">
              Subscribe for quarterly updates on events, fellowships, and tech clinics led by our volunteers.
            </p>
            <form className="mt-6 space-y-4" action="https://formsubmit.co" method="post">
              <input type="hidden" name="_next" value="https://ieee.org" />
              <input type="hidden" name="_subject" value="IEEE BUBT SB Newsletter" />
              <input
                name="email"
                type="email"
                required
                placeholder="Your email"
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:shadow-glow"
              >
                Subscribe
              </button>
              <p className="text-xs text-slate-400">We respect your privacy. Unsubscribe anytime.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
