import FriendRequest from '../models/friendRequest.js'

const getFriendRequestData = async (req, res) => {
   try{
     const { sender, receiver } = req.body;

    //  Basic validation
    if (!sender || !receiver) {
      return res.status(400).json({ message: "Sender and receiver required" });
    }

    //  Prevent sending request to self
    if (sender === receiver) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    //  Check if already exists
    const existing = await FriendRequest.findOne({
          sender,
          receiver,
          status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Create new friend request
    const savedRequest = await FriendRequest.create({
          sender,
          receiver
        });

    res.status(201).json({
      message: "Friend request sent",
      data: savedRequest,
    });


   }
   catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default getFriendRequestData;
