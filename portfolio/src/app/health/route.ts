import { NextResponse } from "next/server";
import dbConnect, { isMongoReady } from "@/lib/dbConnect";
import { createLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const log = createLogger({ context: "app/health" });

export async function GET() {
  try {
    await dbConnect();
  } catch (error) {
    log.error("MongoDB health check failed.", error);
  }

  if (!isMongoReady()) {
    return NextResponse.json(
      { status: "not_ready", database: "disconnected" },
      { status: 503 }
    );
  }

  return NextResponse.json({ status: "ok", database: "connected" }, { status: 200 });
}
