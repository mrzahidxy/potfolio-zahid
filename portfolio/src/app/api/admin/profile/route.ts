import { NextRequest, NextResponse } from "next/server";
import { adminProfileSchema } from "@/lib/profile-admin";
import {
  readAdminProfileApiContent,
  updateAdminProfileContent,
} from "@/lib/profile-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: await readAdminProfileApiContent(),
    });
  } catch (error) {
    console.error("Error loading profile content:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load profile content." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updatedProfile = await updateAdminProfileContent(parsed.data);

    return NextResponse.json({
      success: true,
      message: "Profile content updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile content:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile content." },
      { status: 500 }
    );
  }
}
