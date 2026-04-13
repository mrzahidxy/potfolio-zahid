import { NextResponse } from "next/server";
import { listAdminExperiences } from "@/lib/profile-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const experiences = await listAdminExperiences();
    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    console.error("Error loading public experiences:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load experiences." },
      { status: 500 }
    );
  }
}
