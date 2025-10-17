import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteMetadata } from "@/utils/siteMetadata";

export const metadata: Metadata = {
  title: `Application Submitted | ${siteMetadata.title}`,
  description: "Your membership application has been submitted successfully."
};

export default function ApplySuccessPage({ searchParams }: { searchParams?: { id?: string } }) {
  const id = searchParams?.id;
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="space-y-16 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/5 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-slate-950 to-slate-950" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Application Received</p>
            <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">Thank you for applying</h1>
            <p className="mt-4 text-slate-300">Well review your application and get back to you shortly at the email you provided.</p>
            {id ? (
              <p className="mt-2 text-xs text-slate-400">Reference ID: <span className="font-mono text-slate-300">{id}</span></p>
            ) : null}
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">Go to Home</Link>
              <Link href="/apply" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">Submit another application</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
