import FriendRequest from '../models/friendRequest.js'
import OneToOneChat from '../models/oneToOneChat.js'

const getFriendRequestStatus = async (req, res) => {
   try{
     const { sender, receiver, status } = req.body;

    //  Basic validation
    if (!sender || !receiver || !status) {
      return res.status(400).json({ message: "Sender and receiver required" });
    }

    // Convert to real ObjectId
    sender = new mongoose.Types.ObjectId(sender);
    receiver = new mongoose.Types.ObjectId(receiver);

    const updatedRequest = await FriendRequest.findOneAndUpdate(
     {
       sender,
       receiver,
       status: "pending", // only update pending request
     },
     {
       status: status,
     },
     {
       new: true, // return updated document
     }
    ).lean();

//  IF ACCEPTED → CREATE CHAT
    if (updatedRequest?.status === "accepted") {

      //  prevent duplicate chat
      const existingChat = await OneToOneChat.findOne({
        members: { $all: [sender, receiver] },
      }).lean();;

      if (!existingChat) {
        await OneToOneChat.create({
          members: [sender, receiver],
        });
      }
    }
 // IF REJECTED → DELETE REQUEST
    if (updatedRequest?.status === "rejected") {
      await FriendRequest.deleteOne({
        _id: updatedRequest._id,
      });
    }


    res.status(201).json({
      message: "Friend request status updated",
      data: updatedRequest,
    });

   }
   catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default getFriendRequestStatus;
