import { NextRequest, NextResponse } from "next/server";
import Project, { IProject } from "@/models/Project";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, message: "Database is not configured." },
        { status: 500 }
      );
    }

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
