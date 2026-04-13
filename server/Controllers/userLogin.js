import Users from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getUserLogin = async (req, res) => {
  try {
    console.log('data',req.body)
    const {username,email, password } = req.body;

    // Validate
    if (!username||!email || !password) {
      return res.status(400).json({ message: "Email,username & password are required" });
    }

    // Check user exists
    const user = await Users.findOne({email:email,name:username});
    console.log('user',user)
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    //  Generate token
    const token = jwt.sign({ _id:user._id }, process.env.JWT_TOKEN, {
      expiresIn: "30d",
    });

    // Store token as httpOnly cookie
    res.cookie("usertoken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: false, // set true in production
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    // Success response
    res.json({
      message: "Login successful 🎯",
      user: {
        id: user._id,
        username: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });

  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default getUserLogin;
