"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/CartDrawer";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "bg-cream-50/90 shadow-soft backdrop-blur-md" : "bg-transparent"
        )}
      >
        <nav className="container-atelier flex h-20 items-center justify-between">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            Resin <span className="text-gradient-gold">Atelier</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium text-ink-600 transition-colors hover:text-blush-600",
                  pathname === link.href && "text-ink-900"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-gold-400" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {mounted && session?.user ? (
              <div className="hidden items-center gap-3 lg:flex">
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="btn-secondary !px-4 !py-2 text-xs">
                    <LayoutDashboard className="h-4 w-4" /> Admin
                  </Link>
                )}
                <Link href="/account" className="btn-secondary !px-4 !py-2 text-xs">
                  <User className="h-4 w-4" /> {session.user.name?.split(" ")[0]}
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-ink-400 hover:text-blush-600">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              mounted && (
                <Link href="/login" className="btn-secondary hidden !px-4 !py-2 text-xs lg:inline-flex">
                  <User className="h-4 w-4" /> Sign In
                </Link>
              )
            )}

            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-white/70 text-ink-800 transition-colors hover:border-gold-400"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blush-500 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-ink-900/5 bg-cream-50 px-4 pb-6 pt-2 lg:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-ink-700 hover:bg-blush-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-ink-900/5 pt-3">
                {mounted && session?.user ? (
                  <>
                    {session.user.role === "ADMIN" && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="btn-secondary justify-start">
                        <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link href="/account" onClick={() => setMenuOpen(false)} className="btn-secondary justify-start">
                      <User className="h-4 w-4" /> My Account
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="btn-secondary justify-start text-blush-600"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary justify-start">
                    <User className="h-4 w-4" /> Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}