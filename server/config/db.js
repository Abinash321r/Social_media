import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4", ...dns.getServers()]);

const connectDB = async () => {
  try {
    //,{ family: 4 }
    await mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 100, // Maintain up to 10 socket connections (default is 100)
  minPoolSize: 10,  // Maintain a minimum of 2 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
});
    console.log("MongoDB Atlas Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
