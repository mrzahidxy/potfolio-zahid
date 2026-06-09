import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import dbConnect from "@/lib/dbConnect";
import { findProjectByIdOrSlug } from "@/lib/project-admin";

export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/admin/projects/[id]/restore" });

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, error: "Database is not configured." },
        { status: 500 }
      );
    }

    const project = await findProjectByIdOrSlug(params.id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 }
      );
    }

    project.isArchived = false;
    await project.save();

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    log.error("Failed to restore project.", error);
    return NextResponse.json(
      { success: false, error: "Error restoring project." },
      { status: 500 }
    );
  }
}
