import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import { adminProfileSchema } from "@/lib/profile-admin";
import {
  readAdminProfileApiContent,
  updateAdminProfileContent,
} from "@/lib/profile-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/admin/profile" });

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: await readAdminProfileApiContent(),
    });
  } catch (error) {
    log.error("Failed to load admin profile content.", error);
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
    log.error("Failed to update admin profile content.", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile content." },
      { status: 500 }
    );
  }
}
