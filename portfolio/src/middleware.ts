// app/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { adminMiddleware, authMiddleware } from "./middleware/auth";

const ADMIN_SESSION_COOKIE = "adminAccessToken";

async function hasAdminPageAccess(req: NextRequest) {
  const jwtSecret = process.env.JWT_SEC;
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!jwtSecret || !token) return false;

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    return payload.isAdmin === true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!(await hasAdminPageAccess(req))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // For admin API routes:
  if (pathname.startsWith("/api/admin")) {
    const adminRes = await adminMiddleware(req);
    if (adminRes) return adminRes;
  }
  // For all other API routes:
  else if (pathname.startsWith("/api/user")) {
    const authRes = await authMiddleware(req);
    if (authRes) return authRes;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
