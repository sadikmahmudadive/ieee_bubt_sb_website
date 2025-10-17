import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteMetadata } from "@/utils/siteMetadata";
import { connectToDatabase } from "@/lib/db";
import { News } from "@/models/News";
import type { INews } from "@/models/News";

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const slug = params.slug;
  try {
    await connectToDatabase();
  const item = await News.findOne({ slug, published: true }).lean<INews | null>();
    if (!item) return { title: `News Not Found | ${siteMetadata.shortTitle}` };
    return {
      title: `${item.title} | ${siteMetadata.shortTitle}`,
      description: item.excerpt
    };
  } catch {
    return { title: `News | ${siteMetadata.shortTitle}` };
  }
}

export default async function NewsDetailPage({ params }: Params) {
  const slug = params.slug;
  await connectToDatabase();
  const item = await News.findOne({ slug, published: true }).lean<INews | null>();

  if (!item) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-4xl px-6 py-24">
          <h1 className="text-2xl font-bold">News not found</h1>
          <p className="mt-2 text-gray-600">This news article may have been removed or is not published.</p>
          <div className="mt-6">
            <Link href="/news" className="text-blue-600 hover:text-blue-700">Back to all news</Link>
          </div>
        </main>
        <div className="bg-slate-950">
          <Footer />
        </div>
      </div>
    );
  }

  const dateStr = new Date(item.date).toLocaleDateString();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="pb-24">
        <section className="relative isolate overflow-hidden border-b border-gray-200">
          <div className="relative mx-auto max-w-5xl px-6 pb-10 pt-16 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">{item.category}</p>
            <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">{item.title}</h1>
            <p className="mt-2 text-sm text-gray-500">{dateStr}</p>
          </div>
          {item.imageUrl ? (
            <div className="relative h-[320px] w-full">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
            </div>
          ) : null}
        </section>

        <section className="mx-auto mt-10 w-full max-w-3xl px-6 sm:px-8">
          {item.excerpt ? (
            <p className="text-lg text-gray-700">{item.excerpt}</p>
          ) : null}
          {item.content ? (
            <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : null}
          <div className="mt-10">
            <Link href="/news" className="text-blue-600 hover:text-blue-700">← Back to all news</Link>
          </div>
        </section>
      </main>
      <div className="bg-slate-950">
        <Footer />
      </div>
    </div>
  );
}
