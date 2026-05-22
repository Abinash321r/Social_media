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
avatar: {
  type: String,
  default: "https://res.cloudinary.com/dife61b3b/image/upload/v1778694054/grouchat_avatar_l0zxgb.jpg"
}
}, { timestamps: true });

groupChatSchema.index({ members: 1 });
// Model
const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat;
