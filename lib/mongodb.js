import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cached = global.mongoClientPromise || null;

if (!cached) {
  const client = new MongoClient(MONGODB_URI);
  cached = client.connect();
  global.mongoClientPromise = cached;
}

const clientPromise = cached;
export default clientPromise;
