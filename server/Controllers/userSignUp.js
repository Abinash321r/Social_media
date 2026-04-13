
import 'dotenv/config';
import Users from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getSignUpData = async (req, res) => {
  try {
console.log("📌 Signup endpoint hit");

    console.log("username:", req.body.username);
    console.log("email:", req.body.email);
    console.log("password:", req.body.password);
    console.log("profilePic:", req.file?.path);

    const { username, email, password } = req.body;

    //  Validate
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Check duplicate user
    const existingUser = await Users.findOne({email:email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Store new user in DB
    const newUser = await Users.create({
      name: username,
      email,
      password: hashedPassword,
      profilePic: req?.file?.path|| process.env.DUMMY_PROFILE_PIC, // Cloudinary URL
    });

     //  Generate token
        const token = jwt.sign({ _id:newUser._id }, process.env.JWT_TOKEN, {
          expiresIn: "30d",
        });
    
        // Store token as httpOnly cookie
        res.cookie("usertoken", token, {
          httpOnly: true,
          sameSite: "none",
          secure: false, // set true in production
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    //  Success response
    res.status(201).json({
      message: "Signup successful 🎉",
      user: {
        id: newUser._id,
        username: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });

  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default getSignUpData;