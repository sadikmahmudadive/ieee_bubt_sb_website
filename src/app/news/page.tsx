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
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="space-y-16 pb-24">
        <section className="relative isolate overflow-hidden border-b border-gray-200 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">News</p>
            <h1 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl">Latest updates and announcements</h1>
            <p className="mt-4 max-w-3xl text-gray-600">Stories, achievements, and notices from our community.</p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          {news.length === 0 ? (
            <p className="text-sm text-gray-500">No news has been published yet. Please check back later.</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => (
                <li key={n.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-[0_20px_44px_-28px_rgba(0,0,0,0.1)]">
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
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-100" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-500">{new Date(n.date).toLocaleDateString()}</p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900">{n.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-700">{n.excerpt}</p>
                    <div className="mt-4">
                      <Link href={`/news/${n.slug}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Read more →</Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <div className="bg-slate-950">
        <Footer />
      </div>
    </div>
  );
}
