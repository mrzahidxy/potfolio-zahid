import CryptoJS from "crypto-js";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Register handler
export async function POST(req: NextRequest) {
  await dbConnect();

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
    // Encrypt password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC!
    ).toString();
    // Create and save new user
    const newUser = new User({ email, password: encryptedPassword, isAdmin });
    const savedUser = await newUser.save();

    return NextResponse.json(
      { success: true, user: savedUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
