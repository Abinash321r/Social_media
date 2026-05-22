import User from "../models/userSchema.js";
import mongoose from "mongoose";
const getUser = async (userId) => {
 const objectUserId = new mongoose.Types.ObjectId(userId);

 console.log('i am still running from get user',objectUserId)
  return User.findById(objectUserId)
    .select("-password")
    .lean();
};

export default getUser;