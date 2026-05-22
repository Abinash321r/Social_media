import mongoose from "mongoose";
import GroupChatMsg from "../models/groupChatMsg.js";

const getUnreadCountGroupChat = async (groupchatId, userId) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const objectgroupchatId = new mongoose.Types.ObjectId(
    groupchatId
  );

  const result = await GroupChatMsg.aggregate([
    {
      $match: {
        chatId: objectgroupchatId,
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

export default getUnreadCountGroupChat;