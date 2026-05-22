// controllers/searchUsers.js

import User from "../models/userSchema.js";

const searchUsers = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log('calling from search user',keyword)

    // Basic validation
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        message: "Keyword is required"
      });
    }

    // Search users
    const users = await User.find({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i"
          }
        },
        {
          email: {
            $regex: keyword,
            $options: "i"
          }
        }
      ]
    })
      .select("-password")
      .limit(10)
      .lean();

    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      data: users
    });

  } catch (err) {
    console.log("Search User Error:", err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export default searchUsers;