import FriendRequest from "../models/friendRequest.js";
import mongoose from "mongoose";

const getPendingFriendRequests = async (userId) => {
const objectUserId = new mongoose.Types.ObjectId(userId);
  return FriendRequest.aggregate([
    {
      $match: {
        status: "pending",
        receiver: objectUserId
      }
    },

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
      $unwind: "$sender"
    }
  ]);
};

export default getPendingFriendRequests;