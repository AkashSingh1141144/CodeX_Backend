// src/db/index.js
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";  // 👈 import constant

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    console.log(`✅ MongoDB connected successfully! DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
