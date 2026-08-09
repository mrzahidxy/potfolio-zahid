import { NextResponse } from "next/server";
import Project, { IProject } from "@/models/Project";
import dbConnect from "@/lib/dbConnect";
import { createLogger } from "@/lib/logger";
import { listPublicFallbackProjects } from "@/lib/profile-content";

export const revalidate = 60;
const log = createLogger({ context: "api/projects" });

const withPublicCache = <T>(payload: T) =>
  NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });

export async function GET() {
  try {
    const connection = await dbConnect();
    if (!connection) {
      const projects = await listPublicFallbackProjects();
      return withPublicCache({ success: true, data: projects });
    }

    const projects = await Project.find<IProject>({
      isArchived: { $ne: true },
    });
    return withPublicCache({ success: true, data: projects });
  } catch (error) {
    log.error("Failed to fetch public projects.", error);
    const projects = await listPublicFallbackProjects();
    return withPublicCache({ success: true, data: projects });
  }
}
