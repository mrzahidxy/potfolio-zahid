import { NextRequest, NextResponse } from "next/server";
import Project, { IProject } from "@/models/Project";
import dbConnect from "@/lib/dbConnect";
import { uploadToCloudinary } from "@/helper/common-method";

// Connect to the database before handling requests
dbConnect();

// GET: Fetch all projects
export async function GET() {
  try {
    const projects = await Project.find<IProject>({});
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching projects" },
      { status: 400 }
    );
  }
}


// POST: Create a new project
export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("img") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const technology = formData.get("technology") as string;
    const githubLink = formData.get("githubLink") as string;
    const liveLink = formData.get("liveLink") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileUri = `data:${file.type};base64,${base64Data}`;

    // Upload to Cloudinary
    const res = await uploadToCloudinary(fileUri, file.name);

    if (!res.success) {
      return NextResponse.json(
        { message: "File upload failed" },
        { status: 500 }
      );
    }

    // Create new project with Cloudinary image URL
    const project = new Project({
      title,
      description,
      technology: technology.split(","),
      githubLink,
      liveLink,
      img: (res as any).result.secure_url, // Cloudinary image URL
    });

    const projectres = await project.save();

    return NextResponse.json(
      {
        message: "Project created successfully",
        data: projectres,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Error creating project" },
      { status: 500 }
    );
  }
}
