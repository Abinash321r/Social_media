import mongoose from "mongoose";

const oneToOneChatSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
}, { timestamps: true });

oneToOneChatSchema.index({ members: 1 });
// Model
const OneToOneChat = mongoose.model("OneToOneChat", oneToOneChatSchema);

export default OneToOneChat;
