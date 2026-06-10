import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import dbConnect from "@/lib/dbConnect";
import { findProjectByIdOrSlug, uploadProjectImage } from "@/lib/project-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const log = createLogger({ context: "api/admin/projects/[id]/image" });

export async function POST(
  req: Request,
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

    const formData = await req.formData();
    const file = formData.get("img");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "Project image is required." },
        { status: 400 }
      );
    }

    const project = await findProjectByIdOrSlug(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 }
      );
    }

    const upload = await uploadProjectImage(file);
    if (!upload.success) {
      return NextResponse.json(
        { success: false, error: upload.error },
        { status: 400 }
      );
    }

    project.img = upload.imageUrl;
    await project.save();

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    log.error("Failed to upload project image.", error);
    return NextResponse.json(
      { success: false, error: "Error uploading project image." },
      { status: 500 }
    );
  }
}
