import mongoose from "mongoose";
import dns from "dns";
import { ENV } from "./env.js";

// Ensure Node.js DNS resolves MongoDB Atlas SRV records over Google Public DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  // Ignore DNS override errors if in restricted environment
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[MongoDB Atlas] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to database at ${ENV.MONGODB_URI}. Error: ${error.message}`);
    console.warn("[MongoDB Warning] Operating in standalone API mode. Database queries will return empty datasets or mock fallbacks.");
    return false;
  }
};
