import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteMetadata } from "@/utils/siteMetadata";

export const metadata: Metadata = {
  title: `Apply for Membership | ${siteMetadata.title}`,
  description: "Join IEEE BUBT Student Branch by submitting a membership application."
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="space-y-16 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/5 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-950 to-slate-950" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">Membership Application</p>
            <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">Apply to join IEEE BUBT SB</h1>
            <p className="mt-4 text-slate-300">Fill out the form below and our team will follow up with next steps.</p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 sm:px-8">
          <form action="/api/applications" method="post" className="grid gap-5 rounded-3xl border border-white/15 bg-white/5 p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Full Name
              <input name="fullName" required className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-primary focus:outline-none" placeholder="Your full name" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Email
              <input type="email" name="email" required className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-primary focus:outline-none" placeholder="you@example.com" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Phone
              <input type="tel" name="phone" required className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-primary focus:outline-none" placeholder="01XXXXXXXXX" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Department
              <input name="department" required className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-primary focus:outline-none" placeholder="CSE, EEE, ..." />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Student ID
              <input name="studentId" required className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-primary focus:outline-none" placeholder="BUBT-XXXX-XX" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Chapter/Affinity preference (optional)
              <select name="preference" className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none [color-scheme:dark]">
                <option value="" className="text-slate-900" style={{ color: "#0f172a" }}>No preference</option>
                <option value="ieee-computer-society" className="text-slate-900" style={{ color: "#0f172a" }}>IEEE Computer Society</option>
                <option value="ieee-ras" className="text-slate-900" style={{ color: "#0f172a" }}>IEEE Robotics & Automation Society</option>
                <option value="ieee-photonics" className="text-slate-900" style={{ color: "#0f172a" }}>IEEE Photonics Society</option>
                <option value="ieee-pes" className="text-slate-900" style={{ color: "#0f172a" }}>IEEE Power & Energy Society</option>
                <option value="ieee-systems-council" className="text-slate-900" style={{ color: "#0f172a" }}>IEEE Systems Council</option>
                <option value="ieee-pels" className="text-slate-900" style={{ color: "#0f172a" }}>IEEE Power Electronics Society</option>
                <option value="ieee-wie" className="text-slate-900" style={{ color: "#0f172a" }}>IEEE Women in Engineering (WIE)</option>
              </select>
            </label>
            <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
              Why do you want to join? (optional)
              <textarea name="motivation" rows={4} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-primary focus:outline-none" placeholder="Tell us what you hope to learn or contribute" />
            </label>
            <div className="md:col-span-2 flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" name="agree" required className="rounded border border-white/15 bg-white/10 text-primary focus:border-primary focus:outline-none" />
              <label>I agree to be contacted by IEEE BUBT SB regarding membership.</label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="rounded-lg border border-white/15 bg-primary px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-primary-light">Submit Application</button>
              <Link href="/" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">Cancel</Link>
            </div>
          </form>
          <p className="mt-4 text-center text-xs text-slate-400">You can also apply directly on IEEE if you already have a global account.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
