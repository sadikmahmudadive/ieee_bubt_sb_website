import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteMetadata } from "@/utils/siteMetadata";
import { getNewsItems } from "@/lib/actions";

export const metadata: Metadata = {
  title: `News | ${siteMetadata.shortTitle}`,
  description: "Browse the latest news and announcements from IEEE BUBT SB."
};

export default async function NewsIndexPage() {
  // Fetch more for the listing page
  const news = await getNewsItems(12);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="space-y-16 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/10 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-dark to-primary" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,174,239,0.2),transparent_35%)]" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-soft">News</p>
            <h1 className="mt-5 text-3xl font-light text-white sm:text-4xl">Latest updates and announcements</h1>
            <p className="mt-4 max-w-3xl text-white/80">Stories, achievements, and notices from our community.</p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          {news.length === 0 ? (
            <p className="border border-border bg-white p-8 text-sm text-slate-500 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">No news has been published yet. Please check back later.</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => (
                <li key={n.id} className="overflow-hidden rounded-[5px] border border-border bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:border-cyan-soft hover:shadow-[0_0_2px_2px_rgba(204,204,204,1)]">
                  <div className="relative h-48">
                    {n.imageUrl ? (
                      <Image
                        src={n.imageUrl}
                        alt={n.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-surface via-white to-cyan/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{new Date(n.date).toLocaleDateString()}</p>
                    <h3 className="mt-1 text-lg font-light text-slate-900">{n.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">{n.excerpt}</p>
                    <div className="mt-4">
                      <Link href={`/news/${n.slug}`} className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline hover:underline-offset-8">Read more →</Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
