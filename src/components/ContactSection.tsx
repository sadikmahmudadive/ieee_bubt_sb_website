import { SectionHeading } from "@/components/SectionHeading";
import { siteMetadata } from "@/utils/siteMetadata";

export function ContactSection() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-sky-50 to-white" aria-hidden />
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          id="contact"
          eyebrow="Contact"
          title="Let's Collaborate"
          subtitle="Reach out to IEEE BUBT SB for partnerships, event collaborations, or student membership inquiries."
          tone="light"
        />
        <div className="mt-16 grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[2.3rem] border border-slate-200/70 bg-white p-10 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.18)]">
            <div className="space-y-6">
              <h3 className="heading-font text-2xl font-semibold text-slate-900">Let’s craft the next breakthrough together.</h3>
              <p className="text-sm text-slate-600">
                Share your partnership ideas, invite us to speak at your event, or learn how to empower your peers through IEEE
                programs.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Email</h4>
                  <a href={`mailto:${siteMetadata.social.email}`} className="text-lg text-slate-900 transition hover:text-primary">
                    {siteMetadata.social.email}
                  </a>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Phone</h4>
                  <p className="text-lg text-slate-900/90">{siteMetadata.contact.phone}</p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">HQ</h4>
                  <p className="text-base text-slate-600">{siteMetadata.contact.address}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-sky-50 p-5 text-sm text-slate-600">
                <p>Office Hours: Sun–Thu · 10am – 5pm (BST)</p>
                <p className="mt-1">IEEE Room, 5th Floor, BUBT Permanent Campus</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2.3rem] border border-slate-200/70 bg-white p-8 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.18)]">
            <h3 className="heading-font text-lg font-semibold text-slate-900">Stay Updated</h3>
            <p className="mt-3 text-sm text-slate-600">
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
                className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-slate-800"
              >
                Subscribe
              </button>
              <p className="text-xs text-slate-500">We respect your privacy. Unsubscribe anytime.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
