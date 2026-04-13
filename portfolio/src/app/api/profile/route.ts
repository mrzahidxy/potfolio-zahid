import { NextResponse } from "next/server";
import { readPublicProfileApiContent } from "@/lib/profile-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await readPublicProfileApiContent();
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Error loading public profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load profile content." },
      { status: 500 }
    );
  }
}
