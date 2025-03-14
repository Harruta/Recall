import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}


interface MongooseGlobal {
  conn: mongoose.Connection | null;
  promise: Promise<typeof mongoose> | null;
}

// @ts-ignore
declare global {
  var mongooseGlobal: MongooseGlobal | undefined;
}

/
let cached: MongooseGlobal = global.mongooseGlobal || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  global.mongooseGlobal = cached; 
  return cached.conn;
}

export default dbConnect;
