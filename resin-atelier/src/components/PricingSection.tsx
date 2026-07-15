import Link from "next/link";
import { Type, Bookmark, Camera, IdCard, Frame } from "lucide-react";

const TIERS = [
  {
    icon: Type,
    title: "Resin Alphabet Keychains",
    price: "₹200",
    desc: "A single resin letter charm, glossy and glitter-flecked.",
    href: "/shop?category=keychains",
  },
  {
    icon: Bookmark,
    title: "Resin Bookmark",
    price: "₹250",
    desc: "Pressed flowers set in a slim resin bookmark.",
    href: "/shop?category=bookmarks",
  },
  {
    icon: Camera,
    title: "Photo Keychain",
    price: "₹300",
    desc: "Your favourite photo, sealed in a glossy resin keychain.",
    href: "/shop?category=keychains",
  },
  {
    icon: IdCard,
    title: "Name Stand",
    price: "₹500",
    desc: "A personalised resin name plate for your desk or shelf.",
    href: "/shop?category=name-stands",
  },
  {
    icon: Frame,
    title: "Resin Coasters (Photo Frame)",
    price: "₹800",
    desc: "A resin coaster that doubles as a mini photo frame.",
    href: "/shop?category=coasters",
  },
];

export function PricingSection() {
  return (
    <section className="container-atelier py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="badge mb-3 bg-lavender-100 text-lavender-600">Pricing</p>
        <h2 className="section-title">Simple, Handcrafted Pricing</h2>
        <p className="mt-3 text-ink-500">
          Every piece is made to order — here&apos;s what each of our creations starts at.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <Link
            key={tier.title}
            href={tier.href}
            className="card-atelier group flex flex-col gap-4 p-6 transition-transform hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-lavender-100 text-blush-600 transition-colors group-hover:from-gold-100 group-hover:to-gold-200 group-hover:text-gold-600">
              <tier.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-ink-900">{tier.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{tier.desc}</p>
            </div>
            <p className="mt-auto text-sm font-medium text-ink-400">
              from <span className="font-display text-2xl font-semibold text-ink-900">{tier.price}</span>
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
