import mongoose from "mongoose";
import dns from "node:dns";

// Fix Windows DNS SRV lookup issues for MongoDB Atlas
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // ignore if restricted
}

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Atlas Connection Warning: ${error.message}`);
    if (!process.env.VERCEL) {
      console.log("Attempting fallback to local MongoDB mongodb://127.0.0.1:27017/smartstock...");
      try {
        const fallbackConn = await mongoose.connect("mongodb://127.0.0.1:27017/smartstock", {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`Fallback Local MongoDB Connected: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.warn("MongoDB is currently offline or unreachable.");
      }
    }
  }
};

export default connectDB;
