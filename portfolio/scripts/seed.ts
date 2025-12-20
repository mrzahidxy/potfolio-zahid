// Seed script for projects and an admin user.
// Run with: npm run seed

import dotenv from "dotenv";
import mongoose, { Schema, Document, Model } from "mongoose";
import CryptoJS from "crypto-js";

// Load env from .env.local first, then fallback to .env
dotenv.config({ path: ".env.local" });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";
const PASS_KEY =
  process.env.NEXT_PUBLIC_PASS_SEC || process.env.PASS_SEC || "";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing. Set it in .env.local or .env.");
}

if (!PASS_KEY) {
  throw new Error(
    "PASS_SEC (or NEXT_PUBLIC_PASS_SEC) is missing for password encryption."
  );
}

interface ProjectDoc extends Document {
  title: string;
  description: string;
  technology: string[];
  githubLink: string;
  liveLink?: string;
  img?: string;
}

interface UserDoc extends Document {
  email: string;
  password: string;
  isAdmin: boolean;
}

const projectSchema = new Schema<ProjectDoc>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technology: { type: [String], required: true },
  githubLink: { type: String, required: true },
  liveLink: { type: String },
  img: { type: String },
});

const userSchema = new Schema<UserDoc>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});

const Project: Model<ProjectDoc> =
  mongoose.models.Project || mongoose.model<ProjectDoc>("Project", projectSchema);
const User: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>("User", userSchema);

const projects = [
  {
    title: "Ecommerce Site",
    description:
      "Full-stack eCommerce platform built with Next.js, Express.js, and PostgreSQL, featuring secure authentication (JWT), API development, and Cloudinary integration for media management",
    technology: ["NextJS", "ExpressJS", "Postgres"],
    githubLink: "https://github.com/mrzahidxy/ecommerce-client-react",
    liveLink: "https://procharok-ecommerce.vercel.app/",
    img: "https://res.cloudinary.com/mrzahidxy/image/upload/v1735912041/protfolio-images/ecommerce_vafk4u.png",
  },
  {
    title: "Food Ordering Site",
    description:
      "Online food ordering application developed with Next.js, Tailwind CSS, and Prisma, featuring secure APIs and admin management.",
    technology: ["Next.js", "Tailwind CSS", "Prisma"],
    githubLink: "https://github.com/mrzahidxy",
    liveLink: "https://resturant-order-app.vercel.app/",
    img: "https://res.cloudinary.com/mrzahidxy/image/upload/v1741019343/protfolio-images/Screenshot_2025-03-03_222136_oycz79.png",
  },
  {
    title: "Chat App",
    description:
      "Chat application using React, Firebase, and Tailwind CSS, supporting real-time messaging and authentication.",
    technology: ["ReactJS", "Firebase"],
    githubLink: "https://github.com/mrzahidxy/ecommerce-client-react",
    liveLink: "https://lipy.vercel.app/",
    img: "https://res.cloudinary.com/mrzahidxy/image/upload/v1741281497/protfolio-images/lippy_x0ygfl.png",
  },
  {
    title: "Book Inn.",
    description:
      "A full-stack booking platform for hotels and restaurants. Features include user authentication, role-based access, room management, cloud image upload, and real-time booking with calendar.",
    technology: ["ReactJS", "NextJS", "NodeJS", "ExpressJS", "Postgres", "Prisma"],
    githubLink: "https://github.com/mrzahidxy",
    liveLink: "https://bookinn-client.vercel.app/",
    img: "https://res.cloudinary.com/mrzahidxy/image/upload/v1742715967/protfolio-images/book-inn_xgiljq.png",
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  for (const project of projects) {
    const normalizedTech = project.technology.map((t) => t.trim());
    await Project.findOneAndUpdate(
      { title: project.title },
      { ...project, technology: normalizedTech },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded/updated ${projects.length} projects.`);

  const encryptedPassword = CryptoJS.AES.encrypt(ADMIN_PASSWORD, PASS_KEY).toString();
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { email: ADMIN_EMAIL, password: encryptedPassword, isAdmin: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`Admin user upserted: ${ADMIN_EMAIL}`);

  await mongoose.disconnect();
  console.log("Seeding complete. Connection closed.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
