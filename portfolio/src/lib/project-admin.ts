import { z } from "zod";
import Project from "@/models/Project";
import { uploadToCloudinary } from "@/helper/common-method";
import type { ProjectPayload } from "@/lib/project-types";

export const projectPayloadSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  technology: z.string().trim().min(1, "At least one technology is required"),
  githubLink: z.string().trim().url("GitHub URL is required"),
  liveLink: z.string().trim().url("Invalid live link URL").optional().or(z.literal("")),
});

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const createSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const parseTechnology = (technology: string) =>
  technology
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const projectDataFromPayload = (payload: ProjectPayload) => ({
  title: payload.title,
  slug: createSlug(payload.title),
  description: payload.description,
  technology: parseTechnology(payload.technology),
  githubLink: payload.githubLink,
  liveLink: payload.liveLink || undefined,
});

export const isValidImageFile = (file: File) =>
  Boolean(file.name && file.size > 0 && allowedImageTypes.has(file.type));

export const uploadProjectImage = async (file: File) => {
  if (!isValidImageFile(file)) {
    return { success: false as const, error: "Unsupported image file type." };
  }

  const fileBuffer = await file.arrayBuffer();
  const base64Data = Buffer.from(fileBuffer).toString("base64");
  const fileUri = `data:${file.type};base64,${base64Data}`;
  const uploadRes = await uploadToCloudinary(fileUri, file.name);

  if (!uploadRes.success) {
    return { success: false as const, error: "Image upload failed." };
  }

  return { success: true as const, imageUrl: uploadRes.result.secure_url };
};

export const findProjectByIdOrSlug = async (idOrSlug: string) => {
  const project = await Project.findById(idOrSlug).catch(() => null);
  if (project) return project;
  return Project.findOne({ slug: idOrSlug });
};
