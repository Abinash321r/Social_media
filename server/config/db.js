import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4", ...dns.getServers()]);

const connectDB = async () => {
  try {
    //,{ family: 4 }
    await mongoose.connect(process.env.MONGO_URI,{maxPoolSize: 500});
    console.log("MongoDB Atlas Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
