import { NextResponse } from "next/server";
import Project, { IProject } from "@/models/Project";
import dbConnect from "@/lib/dbConnect";
import { createLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/projects/archived" });

export async function GET() {
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, message: "Database is not configured." },
        { status: 500 }
      );
    }

    const projects = await Project.find<IProject>({ isArchived: true });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    log.error("Failed to fetch archived projects.", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching archived projects." },
      { status: 500 }
    );
  }
}
