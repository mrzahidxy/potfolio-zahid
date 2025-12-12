import mongoose from "mongoose";

const getMongoUri = () =>
  process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI || "";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const uri = getMongoUri();

  if (!uri) {
    console.warn(
      "MONGODB_URI is not defined. Database features will be unavailable."
    );
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
