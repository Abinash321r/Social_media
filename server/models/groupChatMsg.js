import mongoose from "mongoose";

const groupChatMsg = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "GroupChat",
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  text: {
    type: String,
  },

  status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent",
  },
  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, { timestamps: true });

groupChatMsg.index({ chatId: 1, createdAt: -1 });
groupChatMsg.index({ chatId: 1, status: 1 });
groupChatMsg.index({ chatId: 1, seenBy: 1 });

// Model
const GroupChatMsg = mongoose.model("GroupChatMsg", groupChatMsg);

export default GroupChatMsg;
