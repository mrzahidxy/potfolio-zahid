import { NextRequest, NextResponse } from "next/server";
import Project, { IProject } from "@/models/Project";
import dbConnect from "@/lib/dbConnect";
import { verifyTokenAndAdmin } from "../auth/verifyToken";
import { uploadToCloudinary } from "@/helper/common-method";

// Connect to the database before handling requests
dbConnect();

export async function GET(req: NextRequest) {

  console.log("Fetching projects...");
  try {
    
    const projects = await Project.find<IProject>({});
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching projects." },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    // Verify the token first
    const tokenResponse = await verifyTokenAndAdmin(
      req,
      NextResponse.next(),
      () => {}
    );

    // If token verification fails, return the response directly
    if (tokenResponse instanceof NextResponse) {
      return tokenResponse; // Token is either invalid or missing
    }

    const formData = await req.formData();
    const file = formData.get("img") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const technology = formData.get("technology") as string | null;
    const githubLink = formData.get("githubLink") as string | null;
    const liveLink = formData.get("liveLink") as string | null;

    let img: string | undefined = undefined;

    // If an image is provided, upload it to Cloudinary
    if (file) {
      const fileBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(fileBuffer).toString("base64");
      const fileUri = `data:${file.type};base64,${base64Data}`;

      // Upload to Cloudinary
      const uploadRes = await uploadToCloudinary(fileUri, file.name);

      if (!uploadRes.success) {
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 }
        );
      }

      img = (uploadRes as any).result.secure_url; // Get the new Cloudinary image URL
    }

    // Create a new project object with the fields provided
    const newProject = {
      title,
      description,
      technology: technology ? technology.split(",") : [], // Convert string to array if provided
      githubLink,
      liveLink,
      img, // Only include the image if one was uploaded
    };

    // Insert the new project into the database
    const project = await Project.create(newProject);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ success: false, message: "Error creating project" }, { status: 400 });
  }
}
