import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { siteMetadata } from "@/utils/siteMetadata";

export const metadata: Metadata = {
  title: `Apply for Membership | ${siteMetadata.title}`,
  description: "Join IEEE BUBT Student Branch by submitting a membership application."
};

const chapters = [
  "IEEE Computer Society",
  "IEEE Robotics and Automation Society",
  "IEEE Photonics Society",
  "IEEE Power and Energy Society",
  "IEEE Systems Council",
  "IEEE Power Electronics Society",
  "IEEE Women in Engineering (WIE)"
];

const fieldClass = "border border-cyan-soft bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-slate-700";

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="space-y-16 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/10 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-dark to-primary" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,174,239,0.18),transparent_35%)]" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-soft">Membership Application</p>
            <h1 className="mt-5 text-3xl font-light text-white sm:text-4xl">Apply to join IEEE BUBT SB</h1>
            <p className="mt-4 text-white/80">Complete the form to receive your unique application token.</p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-6 sm:px-8">
          <form action="/api/applications" method="post" className="grid gap-5 border border-border bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] md:grid-cols-2 sm:p-8">
            <label className={labelClass}>Name<input name="fullName" required className={fieldClass} placeholder="Your full name" autoComplete="name" /></label>
            <label className={labelClass}>BUBT Student ID<input name="studentId" required className={fieldClass} placeholder="Your student ID" /></label>
            <label className={labelClass}>Department<input name="department" required className={fieldClass} placeholder="CSE, EEE, Textile..." /></label>
            <label className={labelClass}>Day / Evening<select name="shift" required defaultValue="" className={fieldClass}><option value="" disabled>Select shift</option><option value="Day">Day</option><option value="Evening">Evening</option></select></label>
            <label className={labelClass}>Intake<input name="intake" required className={fieldClass} placeholder="e.g. 52" /></label>
            <label className={labelClass}>Section<input name="section" required className={fieldClass} placeholder="e.g. 1" /></label>
            <label className={labelClass}>Year and Semester<input name="yearSemester" required className={fieldClass} placeholder="e.g. 3rd Year, 1st Semester" /></label>
            <label className={labelClass}>Phone (WhatsApp)<input type="tel" name="phone" required className={fieldClass} placeholder="+880 1XXXXXXXXX" autoComplete="tel" /></label>
            <label className={labelClass}>Email<input type="email" name="email" required className={fieldClass} placeholder="you@example.com" autoComplete="email" /></label>
            <label className={labelClass}>Emergency Contact No.<input type="tel" name="emergencyContact" required className={fieldClass} placeholder="+880 1XXXXXXXXX" /></label>
            <label className={labelClass}>Expertise Field<textarea name="expertiseField" required rows={3} className={fieldClass} placeholder="Programming, design, robotics..." /></label>
            <label className={labelClass}>Area of Interest<textarea name="areaOfInterest" required rows={3} className={fieldClass} placeholder="Research, events, volunteering..." /></label>
            <label className={`${labelClass} md:col-span-2`}>Interested Chapter<select name="interestedChapter" required defaultValue="" className={fieldClass}><option value="" disabled>Select a chapter or affinity group</option>{chapters.map((chapter) => <option key={chapter} value={chapter}>{chapter}</option>)}</select></label>
            <label className="md:col-span-2 flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" name="agree" required className="mt-1 border-cyan-soft text-primary focus:ring-primary" /><span>I agree to be contacted by IEEE BUBT SB regarding this membership application.</span></label>
            <div className="md:col-span-2 flex flex-wrap gap-4 pt-4">
              <button type="submit" className="rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">Submit Application</button>
              <Link href="/" className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">Cancel</Link>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
