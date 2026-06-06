import { NextResponse } from "next/server";
import { listAdminExperiences } from "@/lib/profile-content";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/experiences" });

export async function GET() {
  try {
    const experiences = await listAdminExperiences();
    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    log.error("Failed to load public experiences.", error);
    return NextResponse.json(
      { success: false, message: "Failed to load experiences." },
      { status: 500 }
    );
  }
}
