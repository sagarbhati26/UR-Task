import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI || !DB_NAME) {
      console.error("Missing MONGODB_URI or DB_NAME environment variable.");
      process.exit(1);
    }

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        
      }
    );

    console.log(`\n MongoDB connected || DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
