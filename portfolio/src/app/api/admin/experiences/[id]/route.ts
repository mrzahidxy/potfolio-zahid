import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import { adminExperienceSchema } from "@/lib/experience-admin";
import {
  deleteAdminExperience,
  getAdminExperienceById,
  updateAdminExperience,
} from "@/lib/profile-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/admin/experiences/[id]" });

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experience = await getAdminExperienceById(params.id);

    if (!experience) {
      return NextResponse.json(
        { success: false, message: "Experience not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: experience });
  } catch (error) {
    log.error("Failed to load admin experience.", error);
    return NextResponse.json(
      { success: false, message: "Failed to load experience." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = adminExperienceSchema.safeParse(body);

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

    const experience = await updateAdminExperience(params.id, parsed.data);

    if (!experience) {
      return NextResponse.json(
        { success: false, message: "Experience not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience,
      message: "Experience updated successfully.",
    });
  } catch (error) {
    log.error("Failed to update admin experience.", error);
    return NextResponse.json(
      { success: false, message: "Failed to update experience." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteAdminExperience(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Experience not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Experience deleted successfully.",
    });
  } catch (error) {
    log.error("Failed to delete admin experience.", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete experience." },
      { status: 500 }
    );
  }
}
