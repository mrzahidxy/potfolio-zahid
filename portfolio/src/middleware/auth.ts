// app/middleware/auth.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SEC || "");

async function authorizeRequest(
  req: Request,
  { requireAdmin = false }: { requireAdmin?: boolean } = {}
) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { success: false, error: "User is unauthenticated." },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(token, secret);
    if (requireAdmin && !payload.isAdmin) {
      return NextResponse.json(
        { success: false, error: "You are not an admin." },
        { status: 403 }
      );
    }

    const response = NextResponse.next();
    response.headers.set("x-user", JSON.stringify(payload));
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token." },
      { status: 403 }
    );
  }
}

export function authMiddleware(req: Request) {
  return authorizeRequest(req);
}

export function adminMiddleware(req: Request) {
  return authorizeRequest(req, { requireAdmin: true });
}
