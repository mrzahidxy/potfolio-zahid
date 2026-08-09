import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

// Login handler
export async function POST(req: NextRequest) {
  const log = createLogger({ context: "api/auth/login" });
  const passSecret = process.env.PASS_SEC;
  const jwtSecret = process.env.JWT_SEC;

  if (!passSecret || !jwtSecret) {
    return NextResponse.json(
      { success: false, error: "Authentication is not configured." },
      { status: 500 }
    );
  }

  const connection = await dbConnect();
  if (!connection) {
    return NextResponse.json(
      { success: false, message: "Database is not configured." },
      { status: 500 }
    );
  }

  try {
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );

    // Decrypt stored password
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      passSecret
    );

    const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== password)
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );

    // Create JWT token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      jwtSecret,
      { expiresIn: "3d" }
    );

    const { password: _, ...others } = (user as any)._doc;

    const response = NextResponse.json(
      { success: true, data: { ...others, accessToken } },
      { status: 200 }
    );

    if (user.isAdmin === true) {
      response.cookies.set("adminAccessToken", accessToken, {
        path: "/admin",
        maxAge: 60 * 60 * 24 * 3,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch (error) {
    log.error("Failed to create login session.", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
