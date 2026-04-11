import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { pathToFileURL } from "node:url";

import profile from "../src/data/profile.json";
import PortfolioContent from "../src/models/PortfolioContent";
import Project from "../src/models/Project";
import User from "../src/models/User";

dotenv.config({ path: ".env.local" });
dotenv.config();

const PORTFOLIO_CONTENT_KEY = "primary";

type SeedConfig = {
  mongodbUri: string;
  passKey: string;
  adminEmail: string;
  adminPassword: string;
};

type ProjectSeedRecord = {
  title: string;
  description: string;
  technology: string[];
  githubLink: string;
  liveLink: string;
  img: string;
  isArchived: boolean;
};

const projectRecords: ProjectSeedRecord[] = [
  {
    title: "Ecommerce Site",
    description:
      "Full-stack commerce platform built for real catalog, checkout, payment, and media workflows rather than a static storefront.",
    technology: ["NextJS", "ExpressJS", "Postgres"],
    githubLink: "https://github.com/mrzahidxy/ecommerce-client-react",
    liveLink: "https://procharok-ecommerce.vercel.app/",
    img: "https://res.cloudinary.com/mrzahidxy/image/upload/v1735912041/protfolio-images/ecommerce_vafk4u.png",
    isArchived: false,
  },
  {
    title: "Food Ordering Site",
    description:
      "Food ordering platform focused on smooth customer ordering, secure APIs, and practical admin workflows for daily operations.",
    technology: ["Next.js", "Tailwind CSS", "Prisma"],
    githubLink: "https://github.com/mrzahidxy",
    liveLink: "https://resturant-order-app.vercel.app/",
    img: "https://res.cloudinary.com/mrzahidxy/image/upload/v1741019343/protfolio-images/Screenshot_2025-03-03_222136_oycz79.png",
    isArchived: false,
  },
  {
    title: "Chat App",
    description:
      "Real-time messaging product built around authentication, instant communication, and a clean interface for ongoing conversations.",
    technology: ["ReactJS", "Firebase"],
    githubLink: "https://github.com/mrzahidxy/ecommerce-client-react",
    liveLink: "https://lipy.vercel.app/",
    img: "https://res.cloudinary.com/mrzahidxy/image/upload/v1741281497/protfolio-images/lippy_x0ygfl.png",
    isArchived: false,
  },
  {
    title: "Book Inn.",
    description:
      "Booking platform for hotels and restaurants with authentication, role-based access, inventory handling, and payment-ready reservation flows.",
    technology: [
      "ReactJS",
      "NextJS",
      "NodeJS",
      "ExpressJS",
      "Postgres",
      "Prisma",
    ],
    githubLink: "https://github.com/mrzahidxy",
    liveLink: "https://bookinn-client.vercel.app/",
    img: "https://res.cloudinary.com/mrzahidxy/image/upload/v1742715967/protfolio-images/book-inn_xgiljq.png",
    isArchived: false,
  },
];

function getRequiredEnv(value: string, message: string) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

export function getSeedConfig(): SeedConfig {
  return {
    mongodbUri: getRequiredEnv(
      process.env.MONGODB_URI || "",
      "MONGODB_URI is missing. Set it in .env.local or .env."
    ),
    passKey: getRequiredEnv(
      process.env.NEXT_PUBLIC_PASS_SEC || process.env.PASS_SEC || "",
      "PASS_SEC (or NEXT_PUBLIC_PASS_SEC) is missing for password encryption."
    ),
    adminEmail: getRequiredEnv(
      process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "",
      "SEED_ADMIN_EMAIL (or ADMIN_EMAIL) is missing for admin seeding."
    ),
    adminPassword: getRequiredEnv(
      process.env.SEED_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "",
      "SEED_ADMIN_PASSWORD (or ADMIN_PASSWORD) is missing for admin seeding."
    ),
  };
}

function encryptPassword(password: string, passKey: string) {
  return CryptoJS.AES.encrypt(password, passKey).toString();
}

function normalizeProjectRecords(records: ProjectSeedRecord[]) {
  return records.map((record) => ({
    ...record,
    technology: record.technology.map((item) => item.trim()),
  }));
}

export async function syncAdminUser(config: SeedConfig) {
  await User.findOneAndUpdate(
    { email: config.adminEmail },
    {
      email: config.adminEmail,
      password: encryptPassword(config.adminPassword, config.passKey),
      isAdmin: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return config.adminEmail;
}

export async function syncProjectsToDatabase(records = projectRecords) {
  const normalizedRecords = normalizeProjectRecords(records);

  await Project.deleteMany({});
  await Project.insertMany(normalizedRecords);

  return normalizedRecords.length;
}

export async function syncPortfolioContentToDatabase() {
  await PortfolioContent.findOneAndReplace(
    { key: PORTFOLIO_CONTENT_KEY },
    {
      key: PORTFOLIO_CONTENT_KEY,
      personal_details: profile.personal_details,
      preferences: profile.preferences,
      history: profile.history,
      metadata: profile.metadata,
      content: profile.content,
    },
    { upsert: true }
  );

  return PORTFOLIO_CONTENT_KEY;
}

export async function seedDatabase() {
  const config = getSeedConfig();

  await mongoose.connect(config.mongodbUri);
  console.log("Connected to MongoDB");

  try {
    const adminEmail = await syncAdminUser(config);
    console.log(`Admin sync complete: ${adminEmail}`);

    const projectCount = await syncProjectsToDatabase();
    console.log(
      `Project sync complete. Reset and inserted ${projectCount} records.`
    );

    const portfolioKey = await syncPortfolioContentToDatabase();
    console.log(
      `Portfolio content sync complete: ${portfolioKey} (profile info and experience included).`
    );
  } finally {
    await mongoose.disconnect();
    console.log("Connection closed.");
  }
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  seedDatabase().catch((error) => {
    console.error("Database update failed:", error);
    process.exit(1);
  });
}
