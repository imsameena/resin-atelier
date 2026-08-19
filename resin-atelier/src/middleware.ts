import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // Force the secure (__Secure-) cookie name regardless of what NEXTAUTH_URL
    // says — Vercel production is always HTTPS, and a misconfigured
    // NEXTAUTH_URL (e.g. still pointing at http://localhost) would otherwise
    // make getToken look for the wrong cookie name and silently find nothing.
    secureCookie: true,
  });

  if (!token) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    const res = NextResponse.redirect(signInUrl);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (pathname.startsWith("/admin") && (token as any).role !== "ADMIN") {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
