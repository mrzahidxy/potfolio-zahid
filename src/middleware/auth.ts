// app/middleware/auth.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SEC!);

export async function authMiddleware(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: "User is unauthenticated" },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(token, secret);
    const response = NextResponse.next();
    response.headers.set("x-user", JSON.stringify(payload));
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }
}
