import Image from "next/image";
import { Instagram } from "lucide-react";
import type { GalleryImage } from "@prisma/client";

export function InstagramGallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <section className="container-atelier py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="badge mb-3 bg-gold-100 text-gold-600">@resin.atelier</p>
        <h2 className="section-title">Follow Our Studio</h2>
        <p className="mt-3 text-ink-500">Fresh pours, behind-the-scenes and finished pieces, daily.</p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {images.map((img) => (
          <a
            key={img.id}
            href={img.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl2 bg-blush-50"
          >
            <Image
              src={img.imageUrl}
              alt={img.caption || "Resin Atelier gallery"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 33vw, 16vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink-900/0 transition-colors group-hover:bg-ink-900/40">
              <Instagram className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
