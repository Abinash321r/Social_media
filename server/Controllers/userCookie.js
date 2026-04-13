import User from "../models/userSchema.js";
import FriendRequest from "../models/friendRequest.js";
import OneToOneChat from "../models/oneToOneChat.js";
import GroupChat from "../models/groupChat.js";
import Conversation from "../models/conversationSchema.js";

const getCookieStatus = async (req, res) => {
  try {
    const userId = req.data._id;

    // 1. Batch 1: all independent queries in parallel (unchanged — already good)
    const [user, friendRequests, oneToOneChats, groupChats] = await Promise.all([
      User.findById(userId).select("-password").lean(),
      FriendRequest.find({
        status: "accepted",
        $or: [{ sender: userId }, { receiver: userId }]
      }).populate("sender receiver", "name email profilePic").lean(),
      OneToOneChat.find({ members: userId })
        .populate("members", "name email profilePic")
        .lean(),
      GroupChat.find({ members: userId })
        .populate("members admin", "name email profilePic")
        .lean()
    ]);

    // 2. Friends list (synchronous — unchanged)
    const friends = friendRequests.map(fr => {
      const friend = fr.sender._id.toString() === userId.toString()
        ? fr.receiver : fr.sender;
      return {
        _id: friend._id,
        name: friend.name,
        email: friend.email,
        profilePic: friend.profilePic
      };
    });

    // 3. FIX: ONE bulk query for ALL messages instead of N queries
    const allChatIds = [
      ...oneToOneChats.map(c => c._id),
      ...groupChats.map(c => c._id)
    ];

    const allMessages = await Conversation.aggregate([
      { $match: { chatId: { $in: allChatIds } } },
      { $sort: { chatId: 1, createdAt: -1 } },
      {
        $group: {
          _id: "$chatId",
          messages: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          messages: { $slice: ["$messages", 20] }
        }
      }
    ]);

    // Populate sender info after aggregation
    await Conversation.populate(allMessages, {
      path: "messages.sender",
      select: "name profilePic",
      model: "User"
    });

    // 4. Group messages by chatId in memory (zero extra DB calls)
    const msgsByChatId = {};
    for (const group of allMessages) {
      // Reverse to restore chronological order (we sorted desc to get latest 20)
      msgsByChatId[group._id.toString()] = group.messages.reverse();
    }

    // 5. Attach messages to chats
    const attachMessages = (chats) =>
      chats.map(chat => ({
        ...chat,
        messages: msgsByChatId[chat._id.toString()] ?? []
      }));

    res.status(200).json({
      user,
      friends,
      oneToOneChats: attachMessages(oneToOneChats),
      groupChats: attachMessages(groupChats)
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Error loading dashboard" });
  }
};

export default getCookieStatus;