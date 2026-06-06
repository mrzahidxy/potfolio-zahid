import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";

export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/admin/projects/[id]/archive" });

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, message: "Database is not configured." },
        { status: 500 }
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    project.isArchived = !project.isArchived;
    await project.save();

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: project.isArchived
          ? "Project archived successfully"
          : "Project restored successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    log.error("Failed to toggle archive status.", error);
    return NextResponse.json(
      { success: false, message: "Error updating archive status" },
      { status: 400 }
    );
  }
}
