import mongoose from "mongoose";
import FriendRequest from "../models/friendRequest.js";

const getFriendRequestData = async (req, res) => {
  try {
    let { sender, receiver } = req.body;

    // Basic validation
    if (!sender || !receiver) {
      return res.status(400).json({
        message: "Sender and receiver required"
      });
    }

    // Convert to real ObjectId
    sender = new mongoose.Types.ObjectId(sender);
    receiver = new mongoose.Types.ObjectId(receiver);

    // Prevent self request
    if (sender.toString() === receiver.toString()) {
      return res.status(400).json({
        message: "Cannot send request to yourself"
      });
    }

    // Prevent duplicate or reverse request
    const existing = await FriendRequest.findOne({
      $or: [
        {
          sender,
          receiver,
          status: "pending",
        },
        {
          sender: receiver,
          receiver: sender,
          status:"pending",
        }
      ]
    }).lean();

    if (existing) {
      return res.status(400).json({
        message: "Friend request already exists"
      });
    }

    // Create request
    const savedRequest = await FriendRequest.create({
      sender,
      receiver
    });

    res.status(201).json({
      message: "Friend request sent successfully",
      data: savedRequest
    });

  } catch (err) {
    console.log("Error:", err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export default getFriendRequestData;