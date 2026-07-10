import express, { Request, Response } from "express";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import cors from "cors";
import { incrementVisitCount, readVisitCount } from "./helper";
import mongoose from "mongoose";
import {
  createCorsOriginValidator,
  createOriginGuard,
  parseAllowedOrigins,
  visitRateLimiter,
} from "./security";

dotenv.config({ path: ".env.local" });
dotenv.config();

mongoose.set("bufferCommands", false);

const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch(() => {
      console.error("MongoDB connection failed; service will keep running");
    });
} else {
  console.error("MONGODB_URI is not configured; service will keep running without database readiness");
}

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected");
});

mongoose.connection.on("error", () => {
  console.error("MongoDB connection error");
});

const app = express();
const PORT = process.env.PORT ?? 8080;
const HOST = process.env.HOST ?? "0.0.0.0";
const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);

app.use(createOriginGuard(allowedOrigins, process.env.NODE_ENV));
app.use(
  cors({
    origin: createCorsOriginValidator(allowedOrigins, process.env.NODE_ENV),
  })
);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/ready", (_req: Request, res: Response) => {
  if (mongoose.connection.readyState === 1) {
    res.json({ status: "ready", database: "connected" });
    return;
  }

  res.status(503).json({ status: "not_ready", database: "disconnected" });
});

app.post("/api/visit", visitRateLimiter, async (_req: Request, res: Response) => {
  try {
    const updatedCount = await incrementVisitCount();
    broadcastVisitCount(updatedCount);
    res.json({ message: `Portfolio visited ${updatedCount} times.`, count: updatedCount });
  } catch {
    console.error("Failed to increment visit count");
    res.status(500).json({ error: "Failed to increment visit count" });
  }
});

app.get("/api/visit", async (_req: Request, res: Response) => {
  try {
    const visitCount = await readVisitCount();
    res.json({ count: visitCount });
  } catch {
    console.error("Failed to read visit count");
    res.status(500).json({ error: "Failed to read visit count" });
  }
});

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", async (ws: WebSocket) => {
  console.log("New client connected");

  try {
    const visitCount = await readVisitCount();
    ws.send(JSON.stringify({ type: "visit_count", count: visitCount }));
  } catch (error) {
    console.error("Error sending initial visit count:", error);
  }

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const broadcastVisitCount = (visitCount: number) => {
  const message = JSON.stringify({ type: "visit_count", count: visitCount });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
