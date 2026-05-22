import mongoose from "mongoose";

const oneToOneChatMsg = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "OneToOneChat",
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

oneToOneChatMsg.index({ chatId: 1, createdAt: -1 });
oneToOneChatMsg.index({ chatId: 1, status: 1 });
oneToOneChatMsg.index({ chatId: 1, seenBy: 1 });


// Model
const OneToOneChatMsg = mongoose.model("OneToOneChatMsg", oneToOneChatMsg);

export default OneToOneChatMsg;




