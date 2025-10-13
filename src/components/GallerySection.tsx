import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import type { GalleryItemSummary } from "@/lib/actions";

type GallerySectionProps = {
  items: GalleryItemSummary[];
};

export function GallerySection({ items }: GallerySectionProps) {
  return (
    <section id="gallery" className="relative py-28">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900/40 via-transparent to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Gallery"
          title="Snapshots from Our Flagship Programs"
          subtitle="Memories from workshops, competitions, conferences, and outreach initiatives driven by IEEE BUBT SB."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.length === 0 ? (
            <p className="col-span-full rounded-3xl border border-white/15 bg-slate-950/70 p-10 text-center text-sm text-slate-200">
              Gallery is coming soon.
            </p>
          ) : (
            items.map((item) => (
              <figure key={item._id} className="group overflow-hidden rounded-3xl border border-white/15 bg-slate-950/70 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.85)] backdrop-blur">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={`${item.imageUrl}`}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/70 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden />
                  <div className="absolute inset-x-6 bottom-6 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-100 opacity-0 transition group-hover:opacity-100">
                    <span>Captured</span>
                    <span>{item.uploadedAt ? new Date(item.uploadedAt).getFullYear() : ""}</span>
                  </div>
                </div>
                <figcaption className="space-y-2 p-6 text-sm text-slate-200">
                  <p className="heading-font text-lg font-semibold text-white">{item.title}</p>
                  {item.event ? <p className="text-[11px] uppercase tracking-[0.3em] text-primary-light">{item.event}</p> : null}
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
