import mongoose from "mongoose";
import GroupChat from "../models/groupChat.js";
import { io } from "../index.js";
import getGroupChats from "../utils/getGroupChats.js";

const getGroupChatData = async (req, res) => {
  try {
    const { name, members, admin } = req.body;
     const membersArray = JSON.parse(members);
 console.log('group chat',req.body)
    // Basic validation
    if (!name || !members || !admin) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Ensure array
    if (!Array.isArray(membersArray)) {
      return res.status(400).json({
        message: "Members must be an array"
      });
    }

    // Remove duplicates safely
    const uniqueMembers = [
      ...new Set(membersArray.map(id => id.toString()))
    ];

    // Convert to ObjectId
    const objectMembers = uniqueMembers.map(
      id => new mongoose.Types.ObjectId(id)
    );

    // Prevent duplicate group
    const existingChat = await GroupChat.findOne({
      name,
      members: {
        $all: objectMembers,
        $size: objectMembers.length
      }
    }).lean();

    if (existingChat) {
      return res.status(400).json({
        message: "Group already exists"
      });
    }

    // Create group
    const savedGroup = await GroupChat.create({
      name,
      members: objectMembers,
      admin,
      avatar:req?.file?.path
    });

    membersArray.map(async (memberId) => {
    const groupChats= await getGroupChats(memberId)
    io.to(memberId).emit("GroupChats",groupChats);
    });

    res.status(201).json({
      message: "Group chat created successfully",
      data: savedGroup
    });

  } catch (err) {
    console.log("Error:", err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export default getGroupChatData;