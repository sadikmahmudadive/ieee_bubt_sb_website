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
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="space-y-16 pb-24">
        <section className="relative isolate overflow-hidden border-b border-slate-200 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Membership Application</p>
            <h1 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">Apply to join IEEE BUBT SB</h1>
            <p className="mt-4 text-slate-600">Fill out the form below and our team will follow up with next steps.</p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 sm:px-8">
          <form action="/api/applications" method="post" className="grid gap-5 border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Full Name
              <input name="fullName" required className="rounded-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Your full name" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Email
              <input type="email" name="email" required className="rounded-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="you@example.com" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Phone
              <input type="tel" name="phone" required className="rounded-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="01XXXXXXXXX" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Department
              <input name="department" required className="rounded-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="CSE, EEE, ..." />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Student ID
              <input name="studentId" required className="rounded-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="BUBT-XXXX-XX" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Chapter/Affinity preference (optional)
              <select name="preference" className="rounded-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">No preference</option>
                <option value="ieee-computer-society">IEEE Computer Society</option>
                <option value="ieee-ras">IEEE Robotics & Automation Society</option>
                <option value="ieee-photonics">IEEE Photonics Society</option>
                <option value="ieee-pes">IEEE Power & Energy Society</option>
                <option value="ieee-systems-council">IEEE Systems Council</option>
                <option value="ieee-pels">IEEE Power Electronics Society</option>
                <option value="ieee-wie">IEEE Women in Engineering (WIE)</option>
              </select>
            </label>
            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
              Why do you want to join? (optional)
              <textarea name="motivation" rows={4} className="rounded-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Tell us what you hope to learn or contribute" />
            </label>
            <div className="md:col-span-2 flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="agree" required className="rounded-none border border-slate-300 bg-white text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <label>I agree to be contacted by IEEE BUBT SB regarding membership.</label>
            </div>
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button type="submit" className="rounded-none border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">Submit Application</button>
              <Link href="/" className="rounded-none border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">Cancel</Link>
            </div>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">You can also apply directly on IEEE if you already have a global account.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
