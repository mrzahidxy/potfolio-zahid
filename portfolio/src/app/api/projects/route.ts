import { NextResponse } from "next/server";
import Project, { IProject } from "@/models/Project";
import dbConnect from "@/lib/dbConnect";
import { createLogger } from "@/lib/logger";
import { listPublicFallbackProjects } from "@/lib/profile-content";

export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/projects" });

export async function GET() {
  try {
    const connection = await dbConnect();
    if (!connection) {
      const projects = await listPublicFallbackProjects();
      return NextResponse.json({ success: true, data: projects });
    }

    const projects = await Project.find<IProject>({
      isArchived: { $ne: true },
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    log.error("Failed to fetch public projects.", error);
    const projects = await listPublicFallbackProjects();
    return NextResponse.json({ success: true, data: projects });
  }
}
