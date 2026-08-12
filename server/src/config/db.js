import mongoose from "mongoose";
import dns from "node:dns";

// Fix Windows DNS SRV lookup issues for MongoDB Atlas
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // ignore if restricted
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Atlas Connection Warning: ${error.message}`);
    console.log("Attempting fallback to local MongoDB mongodb://127.0.0.1:27017/smartstock...");
    try {
      const fallbackConn = await mongoose.connect("mongodb://127.0.0.1:27017/smartstock", {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`Fallback Local MongoDB Connected: ${fallbackConn.connection.host}`);
      return fallbackConn;
    } catch (fallbackError) {
      console.warn("MongoDB is currently offline or unreachable. Backend running with resilient mock memory store.");
    }
  }
};

export default connectDB;
