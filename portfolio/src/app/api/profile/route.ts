import { NextResponse } from "next/server";
import { readPublicProfileApiContent } from "@/lib/profile-content";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";
export const revalidate = 60;
const log = createLogger({ context: "api/profile" });

export async function GET() {
  try {
    const profile = await readPublicProfileApiContent();
    return NextResponse.json(
      { success: true, data: profile },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    log.error("Failed to load public profile.", error);
    return NextResponse.json(
      { success: false, message: "Failed to load profile content." },
      { status: 500 }
    );
  }
}
