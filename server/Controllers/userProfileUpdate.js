import Users from "../models/userSchema.js";

const userProfileUpdate = async (req, res) => {
  try {
    const userId = req?.data?._id;

    console.log('userid from profileupdate',userId,req.file.path)
    const { name, email } = req.body;

    // Dynamic update object
    const update = {};

    // Add only provided fields
    if (name) {
      update.name = name;
    }

    if (email) {
      update.email = email;
    }

    if (req?.file?.path) {
      update.profilePic = req.file.path;
    }

    // Ensure at least one field exists
    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        message: "At least one field is required"
      });
    }

    // Check duplicate email
    if (email) {
      const existingEmail = await Users.findOne({
        email,
        _id: { $ne: userId }
      }).lean();

      if (existingEmail) {
        return res.status(400).json({
          message: "Email already in use"
        });
      }
    }

    // Update user
    const user = await Users.findByIdAndUpdate(
      userId,
      update,
      {
        new: true,
      }
    ).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user
    });

  } catch (err) {
    console.error("Profile update error:", err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

export default userProfileUpdate;