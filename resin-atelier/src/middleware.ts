import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secretPresent = !!process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    const res = NextResponse.redirect(signInUrl);
    res.headers.set("x-debug-secret-present", String(secretPresent));
    res.headers.set("x-debug-cookie-names", req.cookies.getAll().map((c) => c.name).join(","));
    return res;
  }

  if (pathname.startsWith("/admin") && (token as any).role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
