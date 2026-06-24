import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "madhav-admin-2026";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Check session cookie
  const session = req.cookies.get("admin_session")?.value;
  if (session === ADMIN_PASSWORD) return NextResponse.next();

  // Check basic auth header (for programmatic access)
  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [, pass] = Buffer.from(encoded, "base64").toString().split(":");
      if (pass === ADMIN_PASSWORD) {
        const res = NextResponse.next();
        res.cookies.set("admin_session", ADMIN_PASSWORD, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
        return res;
      }
    }
  }

  // Redirect to login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin-login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
