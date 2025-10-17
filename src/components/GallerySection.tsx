import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import type { GalleryItemSummary } from "@/lib/actions";

type GallerySectionProps = {
  items: GalleryItemSummary[];
};

export function GallerySection({ items }: GallerySectionProps) {
  return (
    <section id="gallery" className="relative py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-50 via-white to-white" aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Gallery"
          title="Snapshots from Our Flagship Programs"
          subtitle="Memories from workshops, competitions, conferences, and outreach initiatives driven by IEEE BUBT SB."
          tone="light"
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.length === 0 ? (
            <p className="col-span-full rounded-3xl border border-slate-200/60 bg-white p-10 text-center text-sm text-slate-600 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.15)]">
              Gallery is coming soon.
            </p>
          ) : (
            items.map((item, index) => (
              <figure
                key={item._id}
                className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_44px_-28px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_-32px_rgba(15,23,42,0.25)] animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={`${item.imageUrl}`}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" aria-hidden />
                  <div className="absolute inset-x-6 bottom-6 flex items-center justify-between text-xs font-medium uppercase tracking-[0.25em] text-white opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                    <span className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">Captured</span>
                    <span className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      {item.uploadedAt ? new Date(item.uploadedAt).getFullYear() : ""}
                    </span>
                  </div>
                </div>
                <figcaption className="space-y-3 p-6 text-sm text-slate-600">
                  <p className="heading-font text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                    {item.title}
                  </p>
                  {item.event ? (
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      {item.event}
                    </p>
                  ) : null}
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
