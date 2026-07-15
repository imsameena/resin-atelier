import Link from "next/link";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ink-900/10 bg-gradient-to-b from-cream-100 to-lavender-50">
      <div className="container-atelier grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-ink-900">
            Resin <span className="text-gradient-gold">Atelier</span>
          </h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500">
            Handcrafted resin keepsakes, keychains and photo frames — made to order, poured with love,
            finished by hand.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-700 shadow-soft transition-colors hover:text-blush-600">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-700 shadow-soft transition-colors hover:text-blush-600">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-900">Shop</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-ink-500">
            <li><Link href="/shop?category=keychains" className="hover:text-blush-600">Resin Keychains</Link></li>
            <li><Link href="/shop?category=bookmarks" className="hover:text-blush-600">Resin Bookmarks</Link></li>
            <li><Link href="/shop?category=name-stands" className="hover:text-blush-600">Name Stands</Link></li>
            <li><Link href="/shop?category=coasters" className="hover:text-blush-600">Resin Coasters</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-900">Company</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-ink-500">
            <li><Link href="/about" className="hover:text-blush-600">About Us</Link></li>
            <li><Link href="/faq" className="hover:text-blush-600">FAQs</Link></li>
            <li><Link href="/contact" className="hover:text-blush-600">Contact</Link></li>
            <li><Link href="/account" className="hover:text-blush-600">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-900">Get in Touch</h4>
          <ul className="flex flex-col gap-3 text-sm text-ink-500">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-500" /> {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-500" /> +91 76610 08991</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-500" /> Made with love, shipped pan-India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-900/10 py-6">
        <p className="container-atelier text-center text-xs text-ink-400">
          © {year} Resin Atelier. All rights reserved. Handcrafted with resin, glitter & gold leaf.
        </p>
      </div>
    </footer>
  );
}