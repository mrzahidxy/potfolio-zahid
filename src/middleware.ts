// app/middleware.ts
import { NextResponse } from "next/server";
import { authMiddleware } from "./middleware/auth";
import { adminMiddleware } from "./middleware/admin";

export async function middleware(req: Request) {
    const { pathname } = new URL(req.url);

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
    matcher: ["/api/:path*"],
};
