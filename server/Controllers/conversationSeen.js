import Conversation from "../models/conversationSchema.js";

const updateConversationStatus = async (req, res) => {
   try{
      const chatId= req.body.chatId
      await Conversation.findByIdAndUpdate(chatId, {
      status: "seen",
      })
    }
   catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default updateConversationStatus;