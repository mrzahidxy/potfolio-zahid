import { NextRequest, NextResponse } from "next/server";
import { adminExperienceSchema } from "@/lib/experience-admin";
import { createLogger } from "@/lib/logger";
import { createAdminExperience, listAdminExperiences } from "@/lib/profile-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/admin/experiences" });

export async function GET() {
  try {
    const experiences = await listAdminExperiences();
    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    log.error("Failed to load admin experiences.", error);
    return NextResponse.json(
      { success: false, message: "Failed to load experiences." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const experience = await createAdminExperience(parsed.data);

    return NextResponse.json(
      { success: true, data: experience, message: "Experience added successfully." },
      { status: 201 }
    );
  } catch (error) {
    log.error("Failed to create admin experience.", error);
    return NextResponse.json(
      { success: false, message: "Failed to create experience." },
      { status: 500 }
    );
  }
}
