import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });
// Model
const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat;
