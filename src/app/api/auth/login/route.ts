import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Login handler
export async function POST(req: NextRequest) {
  await dbConnect();

  const { email, password } = await req.json();

  try {
    // Check if email already exists
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { success: true, message: "Invalid email or password" },
        { status: 201 }
      );

    // Decrypt stored password
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.NEXT_PUBLIC_PASS_SEC as string
    );

    const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== password)
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 201 }
      );

    // Create JWT token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.NEXT_PUBLIC_JWT_SEC as string,
      { expiresIn: "3d" }
    );

    const { password: _, ...others } = (user as any)._doc;

    return NextResponse.json(
      { success: true, data: { ...others, accessToken } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
