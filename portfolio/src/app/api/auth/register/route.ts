import CryptoJS from "crypto-js";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

// Register handler
export async function POST(req: NextRequest) {
  const log = createLogger({ context: "api/auth/register" });
  const connection = await dbConnect();
  if (!connection) {
    return NextResponse.json(
      { success: false, message: "Database is not configured." },
      { status: 500 }
    );
  }

  const { email, password, isAdmin = false } = await req.json();

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }
    const passSecret = process.env.PASS_SEC;
    if (!passSecret) {
      return NextResponse.json(
        { success: false, message: "Password secret is not configured." },
        { status: 500 }
      );
    }

    // Encrypt password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      passSecret
    ).toString();
    // Create and save new user
    const newUser = new User({ email, password: encryptedPassword, isAdmin });
    const savedUser = await newUser.save();

    return NextResponse.json(
      { success: true, user: savedUser },
      { status: 201 }
    );
  } catch (error) {
    log.error("Failed to create user.", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
