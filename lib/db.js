import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully with Mongoose");
    global.mongoose = cached; 
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }

  return cached.conn;
};

export default connectDB;
