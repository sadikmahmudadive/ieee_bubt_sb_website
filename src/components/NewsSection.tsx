import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { NewspaperIcon, CalendarDaysIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug?: string;
  image?: string; // legacy name
  imageUrl?: string; // preferred name
};

type NewsSectionProps = {
  items?: NewsItem[];
};

// Mock news data - in a real app, this would come from an API or CMS
const mockNewsItems: NewsItem[] = [
  {
    id: "1",
    title: "IEEE BUBT SB Wins Regional Student Competition",
    excerpt: "Our team secured first place in the IEEE Region 10 Student Paper Competition, showcasing innovative solutions in renewable energy.",
    date: "2024-01-15",
    category: "Achievements",
    slug: "ieee-bubt-sb-wins-regional-competition"
  },
  {
    id: "2",
    title: "New Partnership with Industry Leaders",
    excerpt: "IEEE BUBT SB announces collaboration with leading tech companies to provide internship opportunities for our members.",
    date: "2024-01-10",
    category: "Partnerships",
    slug: "industry-partnership-announcement"
  },
  {
    id: "3",
    title: "Upcoming Workshop: AI & Machine Learning",
    excerpt: "Join us for an intensive 3-day workshop on Artificial Intelligence and Machine Learning fundamentals and applications.",
    date: "2024-01-20",
    category: "Events",
    slug: "ai-ml-workshop-announcement"
  }
];

export function NewsSection({ items = mockNewsItems }: NewsSectionProps) {
  return (
    <section id="news" className="relative py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-slate-50" aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Latest News"
          title="Stay Updated with IEEE BUBT SB"
          subtitle="Get the latest updates on our achievements, upcoming events, partnerships, and community initiatives."
          tone="light"
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_20px_44px_-28px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_-32px_rgba(15,23,42,0.25)] animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                {(item.imageUrl || item.image) ? (
                  <Image
                    src={(item.imageUrl || item.image) as string}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={index < 2}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-light/10 to-amber-400/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-700">
                    <NewspaperIcon className="h-3 w-3" />
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="mb-4 text-sm text-slate-600 leading-relaxed">
                  {item.excerpt}
                </p>
                {item.slug && (
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors duration-300 group-hover:gap-3"
                  >
                    Read More
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-3 rounded-full border-2 border-primary/20 bg-primary/5 px-8 py-3 text-sm font-bold uppercase tracking-[0.28em] text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
          >
            View All News
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
