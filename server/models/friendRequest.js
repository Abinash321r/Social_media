import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

friendRequestSchema.index({ status: 1, receiver: 1 });
friendRequestSchema.index({ status: 1, sender: 1 });

// Model
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
