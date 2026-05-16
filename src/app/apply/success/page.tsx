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
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="space-y-16 pb-24">
        <section className="relative isolate overflow-hidden border-b border-slate-200 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-white" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Application Received</p>
            <h1 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">Thank you for applying</h1>
            <p className="mt-4 text-slate-600">We'll review your application and get back to you shortly at the email you provided.</p>
            {id ? (
              <p className="mt-2 text-xs text-slate-500">Reference ID: <span className="font-mono text-slate-700 font-medium">{id}</span></p>
            ) : null}
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/" className="rounded-none border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">Go to Home</Link>
              <Link href="/apply" className="rounded-none border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">Submit another application</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
