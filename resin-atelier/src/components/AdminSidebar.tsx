"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink-900/8 px-6 py-6">
        <Link href="/" className="font-display text-xl font-semibold text-ink-900">
          Resin <span className="text-gradient-gold">Atelier</span>
        </Link>
        <p className="mt-0.5 text-xs text-ink-400">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-6">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-gold-50 text-gold-600" : "text-ink-600 hover:bg-ink-900/5"
              )}
            >
              <link.icon className="h-4 w-4" /> {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-900/8 px-4 py-4">
        <p className="px-2 pb-2 text-xs text-ink-400">Signed in as {userName}</p>
        <Link href="/" className="mb-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-900/5">
          <Home className="h-4 w-4" /> Back to Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-blush-600 hover:bg-blush-50"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-ink-900/8 bg-white/70 backdrop-blur lg:block">
        {content}
      </aside>

      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <button onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-cream-50 shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4">
              <X className="h-5 w-5" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
