import express, { Request, Response } from "express";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import cors from "cors";
import { incrementVisitCount, readVisitCount } from "./helper";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });
dotenv.config();

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is required to start the visit counter service");
}

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: unknown) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Express setup
const app = express();
const PORT = process.env.PORT ?? 8010;

app.use(cors());

// REST endpoint that is the single source of truth for increments
app.post("/api/visit", async (_req: Request, res: Response) => {
  try {
    const updatedCount = await incrementVisitCount();
    broadcastVisitCount(updatedCount);
    res.json({ message: `Portfolio visited ${updatedCount} times.`, count: updatedCount });
  } catch (error) {
    console.error("Error incrementing visit count:", error);
    res.status(500).json({ error: "Failed to increment visit count" });
  }
});

// Allow clients to read the current count without incrementing
app.get("/api/visit", async (_req: Request, res: Response) => {
  try {
    const visitCount = await readVisitCount();
    res.json({ count: visitCount });
  } catch (error) {
    console.error("Error reading visit count:", error);
    res.status(500).json({ error: "Failed to read visit count" });
  }
});

// Start the Express server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket setup
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

// Broadcast function
const broadcastVisitCount = (visitCount: number) => {
  const message = JSON.stringify({ type: "visit_count", count: visitCount });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
