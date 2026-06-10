import { NextRequest, NextResponse } from "next/server";

// Protects everything under /admin with HTTP Basic Auth.
// Credentials come from env vars:
//   ADMIN_USER     (defaults to "admin")
//   ADMIN_PASSWORD (required — if unset, access is denied)
//
// The browser shows a native login prompt; no login page needed.

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASSWORD;

  // If no password is configured, lock the admin entirely (fail closed).
  if (!pass) {
    return new NextResponse(
      "Admin is not configured. Set ADMIN_PASSWORD in your environment.",
      { status: 503 }
    );
  }

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6)); // "user:password"
    const idx = decoded.indexOf(":");
    const u = decoded.slice(0, idx);
    const p = decoded.slice(idx + 1);
    if (u === user && p === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Jewel Muse Admin", charset="UTF-8"' },
  });
}
