import mongoose from "mongoose";

import getUser from "../utils/getUser.js";
import getPendingFriendRequests from "../utils/getPendingFriendRequests.js";
import getAcceptedFriendRequests from "../utils/getAcceptedFriendRequests.js";
import getOneToOneChats from "../utils/getOneToOneChats.js";
import getGroupChats from "../utils/getGroupChats.js";
import { isAuthenticated } from "../Middlewares/Authentication.js";


const getCookieStatus = async (req, res) => {
  try {
    const userId = req?.data?._id;

    console.log('userId',userId);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const [
      user,
      pendingfriendRequests,
      friends,
      oneToOneChats,
      groupChats
    ] = await Promise.all([
      getUser(userId),
      getPendingFriendRequests(userId),
      getAcceptedFriendRequests(userId),
      getOneToOneChats(userId),
      getGroupChats(userId)
    ]);

    res.status(200).json({
      user,
      pendingfriendRequests,
      friends,
      oneToOneChats,
      groupChats,
      isAuthenticated:true
    });

  } catch (err) {
    console.error("Dashboard Error:", err);

    res.status(500).json({
      message: "Error loading dashboard",
      isAuthenticated:false
    });
  }
};

export default getCookieStatus;