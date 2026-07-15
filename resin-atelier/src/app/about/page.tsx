import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Leaf, Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

const VALUES = [
  { icon: Heart, title: "Made with Love", desc: "Every piece is poured, cured and finished by hand in small batches." },
  { icon: Sparkles, title: "Truly Custom", desc: "Names, colors, glitter and photos — designed around your story." },
  { icon: Leaf, title: "Thoughtful Materials", desc: "Food-safe, UV-resistant resin that keeps its shine for years." },
  { icon: Package, title: "Careful Packaging", desc: "Every order is wrapped with the same care we put into making it." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="container-atelier py-16 text-center">
        <p className="badge mb-3 bg-lavender-100 text-lavender-600">Our Story</p>
        <h1 className="section-title mx-auto max-w-2xl">Handcrafted Resin, Made with Heart</h1>
        <p className="mx-auto mt-4 max-w-2xl text-ink-500">
          Resin Atelier began on a kitchen table with a single mould, a bottle of resin and a love for making
          things by hand. What started as gifts for friends has grown into a small studio creating custom
          keychains, name tags and photo frames for customers across India — each one poured, personalised and
          finished with care.
        </p>
      </section>

      <section className="container-atelier grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 bg-gradient-to-br from-blush-100 via-lavender-100 to-gold-100 shadow-soft">
          <Image src="/about/studio.jpg" alt="Resin Atelier studio" fill className="object-cover" />
        </div>
        <div>
          <h2 className="section-title">From Studio to Doorstep</h2>
          <p className="mt-4 leading-relaxed text-ink-500">
            Every order begins with your idea — a name, a favourite photo, a colour that means something to you.
            We hand-mix pigments and glitter, pour each mould individually, and cure every piece before it&apos;s
            sanded, polished and packed with care. No two pieces are ever quite the same, and that&apos;s exactly
            the point.
          </p>
          <Link href="/shop" className="btn-primary mt-6">Explore the Collection</Link>
        </div>
      </section>

      <section className="bg-gradient-to-b from-transparent to-lavender-50/60 py-20">
        <div className="container-atelier">
          <h2 className="section-title mb-12 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card-atelier flex flex-col items-center gap-3 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-gold-100 text-blush-600">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-ink-900">{v.title}</h3>
                <p className="text-sm text-ink-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
