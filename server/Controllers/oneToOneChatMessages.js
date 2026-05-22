// controllers/searchUsers.js

import OneToOneChatMsg from "../models/oneToOneChatMsg.js";

const oneToOneChatMessages = async (req, res) => {
  try {
 const {oneToOneChatId} = req.body;
     // Validate
    if (!oneToOneChatId) {
      return res.status(400).json({ message: "chatId required" });
    }
    // Search Messages
    const messages = await OneToOneChatMsg.find({
    chatId: oneToOneChatId,
    })
    .populate("sender", "-password")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    res.status(200).json({
      message: "OneToOneChatMessages fetched successfully",
      data: messages.reverse()
    });

  } catch (err) {
    console.log(" Error:", err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export default oneToOneChatMessages;