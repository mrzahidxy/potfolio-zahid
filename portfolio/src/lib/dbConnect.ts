import mongoose from "mongoose";
import { createLogger } from "@/lib/logger";

export const getMongoUri = () => process.env.MONGODB_URI || "";
const log = createLogger({ context: "lib/dbConnect" });

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedMongoose | undefined;
}

const cached = globalThis.mongoose ?? {
  conn: null,
  promise: null,
};

if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

const isConnected = (conn: typeof mongoose | null) =>
  conn?.connection.readyState === 1;

const resetCache = () => {
  cached.conn = null;
  cached.promise = null;
};

const connectWithCache = async () => {
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(getMongoUri(), { serverSelectionTimeoutMS: 5000 })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    resetCache();
    throw error;
  }
};

async function dbConnect() {
  const uri = getMongoUri();

  if (!uri) {
    log.warn("MONGODB_URI is not defined. Database features will be unavailable.");
    return null;
  }

  if (isConnected(cached.conn)) {
    return cached.conn;
  }

  if (cached.conn && !isConnected(cached.conn)) {
    resetCache();
  }

  return connectWithCache();
}

export function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

export default dbConnect;
