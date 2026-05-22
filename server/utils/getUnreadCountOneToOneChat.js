import mongoose from "mongoose";
import OneToOneChatMsg from "../models/oneToOneChatMsg.js";

const getUnreadCountOneToOneChat = async (oneToonechatId, userId) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const objectoneToonechatId = new mongoose.Types.ObjectId(
    oneToonechatId
  );

  const result = await OneToOneChatMsg.aggregate([
    {
      $match: {
        chatId: objectoneToonechatId,
        sender: { $ne: objectUserId },
        seenBy: { $nin: [objectUserId] },
      },
    },
    {
      $group: {
        _id: "$chatId",
        count: { $sum: 1 },
      },
    },
  ]);

  return result[0]?.count || 0;
};

export default getUnreadCountOneToOneChat;