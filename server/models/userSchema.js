import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    password: {
      type: String,
      required: true,
    },
     profilePic: {
      type: String,
      default: "", // Can store image URL later
    },
  },
  { timestamps: true }
);

// Model
const User = mongoose.model("User", userSchema);

export default User;
