import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secretPresent = !!process.env.NEXTAUTH_SECRET;
  const cookieHeader = req.headers.get("cookie") || "";
  let token: any = null;
  let tokenError = "";
  try {
    token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  } catch (e: any) {
    tokenError = String(e?.message || e);
  }

  const debugHeaders: Record<string, string> = {
    "x-debug-secret-present": String(secretPresent),
    "x-debug-cookie-header-len": String(cookieHeader.length),
    "x-debug-has-session-cookie": String(cookieHeader.includes("next-auth.session-token")),
    "x-debug-token-found": String(!!token),
    "x-debug-token-error": tokenError.slice(0, 200),
  };

  if (!token) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    const res = NextResponse.redirect(signInUrl);
    res.headers.set("Cache-Control", "no-store");
    Object.entries(debugHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  if (pathname.startsWith("/admin") && (token as any).role !== "ADMIN") {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.headers.set("Cache-Control", "no-store");
    Object.entries(debugHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  Object.entries(debugHeaders).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
