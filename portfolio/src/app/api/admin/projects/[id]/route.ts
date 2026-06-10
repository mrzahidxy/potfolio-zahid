import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import {
  findProjectByIdOrSlug,
  projectDataFromPayload,
  projectPayloadSchema,
} from "@/lib/project-admin";

export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/admin/projects/[id]" });

// GET: Fetch a project by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, error: "Database is not configured." },
        { status: 500 }
      );
    }

    const project = await findProjectByIdOrSlug(id);
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    log.error("Failed to fetch project.", error);
    return NextResponse.json(
      { success: false, error: "Error fetching project." },
      { status: 500 }
    );
  }
}

// PATCH: Update a project by ID
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, error: "Database is not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const parsed = projectPayloadSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      technology: formData.get("technology"),
      githubLink: formData.get("githubLink"),
      liveLink: formData.get("liveLink") || "",
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please correct the highlighted fields.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const existing = await findProjectByIdOrSlug(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    const project = await Project.findByIdAndUpdate(existing._id, projectDataFromPayload(parsed.data), {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    log.error("Failed to update project.", error);
    return NextResponse.json(
      { success: false, error: "Error updating project." },
      { status: 500 }
    );
  }
}

export const PUT = PATCH;

// DELETE: Remove a project by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, error: "Database is not configured." },
        { status: 500 }
      );
    }

    const existing = await findProjectByIdOrSlug(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    const deletedProject = await Project.deleteOne({ _id: existing._id });
    if (!deletedProject.deletedCount) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, deletedId: String(existing._id) },
      { status: 200 }
    );
  } catch (error) {
    log.error("Failed to delete project.", error);
    return NextResponse.json(
      { success: false, error: "Error deleting project." },
      { status: 500 }
    );
  }
}
