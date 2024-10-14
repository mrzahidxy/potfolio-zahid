import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import { uploadToCloudinary } from "@/helper/common-method";

// Ensure database connection
dbConnect();

// GET: Fetch a project by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching project" }, { status: 400 });
  }
}

// PUT: Update a project by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
      const formData = await req.formData();
      const file = formData.get("img") as File | null;
      const title = formData.get("title") as string | null;
      const description = formData.get("description") as string | null;
      const technology = formData.get("technology") as string | null;
      const githubLink = formData.get("githubLink") as string | null;
      const liveLink = formData.get("liveLink") as string | null;
  
      let img: string | undefined = undefined;
  
      // If a new image is provided, upload to Cloudinary
      if (file) {
        const fileBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(fileBuffer).toString("base64");
        const fileUri = `data:${file.type};base64,${base64Data}`;
  
        // Upload to Cloudinary
        const uploadRes = await uploadToCloudinary(fileUri, file.name);
  
        if (!uploadRes.success) {
          return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
        }
  
        img = (uploadRes as any).result.secure_url; // Get the new Cloudinary image URL
      }
  
      // Create an update object only with the fields that are provided
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (technology) updateData.technology = technology.split(","); // Convert string to array if provided
      if (githubLink) updateData.githubLink = githubLink;
      if (liveLink) updateData.liveLink = liveLink;
      if (img) updateData.img = img; // Only update the image if provided
  
      // Update the project with the new data
      const project = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!project) {
        return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, data: project }, { status: 200 });
    } catch (error) {
      console.error("Error updating project:", error);
      return NextResponse.json({ success: false, message: "Error updating project" }, { status: 400 });
    }
  }
  
// DELETE: Remove a project by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const deletedProject = await Project.deleteOne({ _id: id });
    if (!deletedProject) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting project" }, { status: 400 });
  }
}
