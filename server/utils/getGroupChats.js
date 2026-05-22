import GroupChat from "../models/groupChat.js";
import mongoose from "mongoose";

const getGroupChats = async (userId) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);
  return GroupChat.aggregate([
    { $match: { members: objectUserId } },

    // 🔹 Latest message
    {
      $lookup: {
        from: "groupchatmsgs",
        let: { chatId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$chatId", "$$chatId"] }
            }
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          {
            $lookup: {
              from: "users",
              let: { senderId: "$sender" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$senderId"] }
                  }
                },
                {
                  $project: { password: 0 }
                }
              ],
              as: "sender"
            }
          },
          {
            $unwind: {
              path: "$sender",
              preserveNullAndEmptyArrays: true
            }
          }
        ],
        as: "lastMessage"
      }
    },
    { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },

    // 🔹 Unread count
    {
      $lookup: {
        from: "groupchatmsgs",
        let: { chatId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$chatId", "$$chatId"] },
                  { $ne: ["$sender", objectUserId] },
                  { $not: { $in: [objectUserId, "$seenBy"] } }
                ]
              }
            }
          },
          { $count: "count" }
        ],
        as: "unread"
      }
    },
    { $addFields: { sortDate: { $ifNull: ["$lastMessage.createdAt", "$createdAt"] } } },
    { $sort: { sortDate: -1 } }
  ]);
};

export default getGroupChats;

/* { $sort: { "lastMessage.createdAt": -1 } }*/