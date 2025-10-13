import mongoose from "mongoose";

const { MONGODB_URI = "" } = process.env;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Database operations will fail until it is configured.");
}

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const connection = await mongoose.connect(MONGODB_URI, {
    dbName: process.env.MONGODB_DB ?? "ieee-bubt-sb"
  });

  cachedConnection = connection;
  return connection;
}
