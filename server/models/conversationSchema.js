import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  chatType: {
    type: String,
    enum: ["one-to-one", "group"],
    required: true,
  },

  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "chatTypeRef",
  },

  chatTypeRef: {
    type: String,
    required: true,
    enum: ["OneToOneChat", "GroupChat"],
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
}, { timestamps: true });

// Model
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
