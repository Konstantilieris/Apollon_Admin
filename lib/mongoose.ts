import mongoose from "mongoose";

const globalWithMongoose = global as typeof global & {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  if (globalWithMongoose.mongoose.conn) {
    console.log("Using existing Mongoose connection");
    return globalWithMongoose.mongoose.conn;
  }

  if (!globalWithMongoose.mongoose.promise) {
    console.log("Establishing new Mongoose connection");
    globalWithMongoose.mongoose.promise = mongoose.connect(
      process.env.DATABASE_URL,
      {
        dbName: "ApolloGuard",
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000,
      }
    );
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  console.log("New Mongoose connection established");
  return globalWithMongoose.mongoose.conn;
};
