import mongoose from "mongoose";
import FriendRequest from "../models/friendRequest.js"

const postFriendRequest = async ( sender, receiver) => {

  // Basic validation
  if (!sender || !receiver) {
    throw new Error("Sender and receiver required");
  }

  // Convert to real ObjectId
  sender = new mongoose.Types.ObjectId(sender);
  receiver = new mongoose.Types.ObjectId(receiver);

  // Prevent self request
  if (sender.toString() === receiver.toString()) {
    throw new Error("Cannot send request to yourself");
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
        status: "pending",
      }
    ]
  }).lean();

  if (existing) {
    throw new Error("Friend request already exists");
    console.log('friend already exist')
  }

  // Create request
  const savedRequest = await FriendRequest.create({
    sender,
    receiver
  });

};

export default postFriendRequest;