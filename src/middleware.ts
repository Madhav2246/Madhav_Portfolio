import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge Runtime — NO Node.js APIs (no Buffer, no crypto, no fs)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "madhav-admin-2026";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin — never intercept /admin-login or /api routes
  if (
    pathname.startsWith("/admin-login") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Check session cookie
  const session = req.cookies.get("admin_session")?.value;
  if (session === ADMIN_PASSWORD) return NextResponse.next();

  // Not authenticated → redirect to login page
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin-login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Match /admin and all sub-paths, but NOT /admin-login or /api
  matcher: ["/admin/:path*"],
};
