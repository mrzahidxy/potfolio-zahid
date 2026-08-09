import { NextResponse } from "next/server";
import { listPublicExperiences } from "@/lib/profile-content";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";
export const revalidate = 60;
const log = createLogger({ context: "api/experiences" });

export async function GET() {
  try {
    const experiences = await listPublicExperiences();
    return NextResponse.json(
      { success: true, data: experiences },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    log.error("Failed to load public experiences.", error);
    return NextResponse.json(
      { success: false, message: "Failed to load experiences." },
      { status: 500 }
    );
  }
}
