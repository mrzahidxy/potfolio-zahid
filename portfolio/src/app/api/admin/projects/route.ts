import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import dbConnect from "@/lib/dbConnect";
import { createLogger } from "@/lib/logger";
import {
  projectDataFromPayload,
  projectPayloadSchema,
  uploadProjectImage,
} from "@/lib/project-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/admin/projects" });

export async function GET() {
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, error: "Database is not configured." },
        { status: 500 }
      );
    }

    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error) {
    log.error("Failed to fetch admin projects.", error);
    return NextResponse.json(
      { success: false, error: "Error fetching projects." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, error: "Database is not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("img") as File | null;
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

    const newProject: Record<string, unknown> = projectDataFromPayload(parsed.data);

    if (file && file.size > 0) {
      const upload = await uploadProjectImage(file);
      if (!upload.success) {
        return NextResponse.json(
          { success: false, error: upload.error },
          { status: 400 }
        );
      }
      newProject.img = upload.imageUrl;
    }

    const project = await Project.create(newProject);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project creation failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    log.error("Failed to create project.", error);
    return NextResponse.json(
      { success: false, error: "Error creating project." },
      { status: 500 }
    );
  }
}
