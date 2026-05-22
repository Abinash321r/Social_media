import OneToOneChat from "../models/oneToOneChat.js";
import mongoose from "mongoose";

const getOneToOneChats = async (userId) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  return OneToOneChat.aggregate([
    {
      $match: {
        members: objectUserId
      }
    },

    // Populate members
    {
      $lookup: {
        from: "users",
        let: { memberIds: "$members" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$memberIds"]
              }
            }
          },
          {
            $project: {
              password: 0
            }
          }
        ],
        as: "members"
      }
    },

    // Latest message
    {
      $lookup: {
        from: "onetoonechatmsgs",
        let: { chatId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$chatId", "$$chatId"]
              }
            }
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },

          // Populate sender
          {
            $lookup: {
              from: "users",
              let: { senderId: "$sender" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$senderId"]
                    }
                  }
                },
                {
                  $project: {
                    password: 0
                  }
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

    {
      $unwind: {
        path: "$lastMessage",
        preserveNullAndEmptyArrays: true
      }
    },

    // unread count
    {
      $lookup: {
        from: "onetoonechatmsgs",
        let: { chatId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$chatId", "$$chatId"] },
                  { $ne: ["$sender", objectUserId] },
                  {
                    $not: {
                      $in: [objectUserId, "$seenBy"]
                    }
                  }
                ]
              }
            }
          },
          {
            $count: "count"
          }
        ],
        as: "unread"
      }
    },

    {
      $addFields: {
        sortDate: {
          $ifNull: [
            "$lastMessage.createdAt",
            "$createdAt"
          ]
        }
      }
    },

    {
      $sort: {
        sortDate: -1
      }
    }
  ]);
};

export default getOneToOneChats;