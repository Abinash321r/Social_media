import FriendRequest from "../models/friendRequest.js";
import mongoose from "mongoose";

const getAcceptedFriendRequests = async (userId) => {
 const objectUserId = new mongoose.Types.ObjectId(userId);
  const acceptedfriendRequests = await FriendRequest.aggregate([
    {
      $match: {
        status: "accepted",
        $or: [
          { sender: objectUserId },
          { receiver: objectUserId }
        ]
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
    },

    {
      $lookup: {
        from: "users",
        let: { receiverId: "$receiver" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$receiverId"]
              }
            }
          },
          {
            $project: {
              password: 0
            }
          }
        ],
        as: "receiver"
      }
    },

    {
      $unwind: "$receiver"
    }
  ]);
    // Friends list (synchronous — unchanged)
    const friends = acceptedfriendRequests.map(fr => {
      const friend = fr.sender._id.toString() === objectUserId.toString()
        ? fr.receiver : fr.sender;
      return {
        _id: friend._id,
        name: friend.name,
        email: friend.email,
        profilePic: friend.profilePic,
      };
    });
  
    return friends;

};

export default getAcceptedFriendRequests;





