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
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {items.length === 0 ? (
            <p className="col-span-full rounded-3xl border border-slate-200/60 bg-white p-10 text-center text-sm text-slate-600 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.15)]">
              Gallery is coming soon.
            </p>
          ) : (
            items.map((item) => (
              <figure key={item._id} className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_44px_-28px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={`${item.imageUrl}`}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/70 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden />
                  <div className="absolute inset-x-5 bottom-5 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/85 opacity-0 transition group-hover:opacity-100">
                    <span>Captured</span>
                    <span>{item.uploadedAt ? new Date(item.uploadedAt).getFullYear() : ""}</span>
                  </div>
                </div>
                <figcaption className="space-y-2 p-6 text-sm text-slate-600">
                  <p className="heading-font text-lg font-semibold text-slate-900">{item.title}</p>
                  {item.event ? <p className="text-[11px] uppercase tracking-[0.3em] text-primary">{item.event}</p> : null}
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
