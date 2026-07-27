import { NewsletterSignupForm } from "@/components/NewsletterSignupForm";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { siteMetadata } from "@/utils/siteMetadata";

export function ContactSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-surface to-white" aria-hidden />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            id="contact"
            eyebrow="Contact"
            title="Let&apos;s Collaborate"
            subtitle="Reach out to IEEE BUBT SB for partnerships, event collaborations, or student membership inquiries."
            tone="light"
          />
        </Reveal>
        <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-[1.2fr_1fr]">
          <Reveal x={-30} duration={0.8}>
            <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="space-y-5 sm:space-y-6">
                <h3 className="heading-font text-xl sm:text-2xl font-light text-slate-900">
                  Let&apos;s craft the next breakthrough together.
                </h3>
                <p className="text-sm text-slate-600">
                  Share your partnership ideas, invite us to speak at your event, or learn how to empower your peers through IEEE programs.
                </p>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Email</h4>
                    <a href={`mailto:${siteMetadata.social.email}`} className="block text-sm sm:text-base lg:text-lg text-slate-900 transition hover:text-primary break-all">
                      {siteMetadata.social.email}
                    </a>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Phone</h4>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-900/90">{siteMetadata.contact.phone}</p>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 xs:col-span-2">
                    <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">HQ</h4>
                    <p className="text-sm sm:text-base text-slate-600">{siteMetadata.contact.address}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-cyan-soft bg-cyan/5 p-4 sm:p-5 text-xs sm:text-sm text-slate-600">
                  <p>Office Hours: Sun–Thu · 10am – 5pm (BST)</p>
                  <p className="mt-1">IEEE Room, 5th Floor, BUBT Permanent Campus</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal x={30} duration={0.8} delay={0.2}>
            <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h3 className="heading-font text-base sm:text-lg font-light text-slate-900">Stay Updated</h3>
              <p className="mt-2 sm:mt-3 text-sm text-slate-600">
                Subscribe for quarterly updates on events, fellowships, and tech clinics led by our volunteers.
              </p>
              <NewsletterSignupForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

