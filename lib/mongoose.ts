import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.DATABASE_URL) {
    return console.log("Missing DATABASE_URL");
  }
  if (isConnected) {
    return console.log("MONGODB is already connected");
  }
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: "ApolloGuard",
    });
    isConnected = true;
    console.log("Mongodb is connected");
  } catch (error) {
    console.log("Mongodb connection failed", error);
  }
};
