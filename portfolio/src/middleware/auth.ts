// app/middleware/auth.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecret = () => process.env.JWT_SEC;

async function authorizeRequest(
  req: Request,
  { requireAdmin = false }: { requireAdmin?: boolean } = {}
) {
  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    return NextResponse.json(
      { success: false, error: "Authentication is not configured." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { success: false, error: "User is unauthenticated." },
      { status: 401 }
    );
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return NextResponse.json(
      { success: false, error: "User is unauthenticated." },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    if (requireAdmin && payload.isAdmin !== true) {
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
