// controllers/searchUsers.js

import GroupChatMsg from "../models/groupChatMsg.js";

const groupChatMessages = async (req, res) => {
  try {
 const {groupChatId} = req.body;

      // Validate
    if (!groupChatId) {
      return res.status(400).json({ message: "chatId required" });
    }
    // Search Messages
    const messages = await GroupChatMsg.find({
    chatId: groupChatId,
    })
    .populate("sender", "-password")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    res.status(200).json({
      message: "groupChatMessages fetched successfully",
      data: messages.reverse()
    });

  } catch (err) {
    console.log(" Error:", err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export default groupChatMessages;