import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in your environment variables.");
}

// 1. Properly target the global object
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // 2. We assign the promise chain directly
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("🚀 MongoDB Connected Successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        cached.promise = null; // 🔴 CRITICAL: Clear cache on failure so next attempt tries again
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Double-guard against a poisoned promise cache
    throw e;
  }

  return cached.conn;
}