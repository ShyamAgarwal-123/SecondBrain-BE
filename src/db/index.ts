import mongoose from "mongoose";
import { DB_NAME } from "../constants";
const dbConnect = async (): Promise<void> => {
  try {
    const connectionInstance: typeof mongoose = await mongoose.connect(
      `${process.env.DB_URI}/${DB_NAME}` as string
    );
    console.log(
      "MongoDB connected successfully, " +
        `Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default dbConnect;
