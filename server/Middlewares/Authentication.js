import jwt from "jsonwebtoken";
import 'dotenv/config';
import  Users  from '../models/userSchema.js'

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.usertoken;
    console.log('token',token)
    if (!token) {
      return res.status(401).json({ message: "No Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    // req.data = await Users.findById(decoded);
    // console.log(req.data);
    req.data = decoded
    next(); // Continue to next function (controller)
    
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
