import jwt from "jsonwebtoken";
import User from "../models/user.js";

//Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.json({ sucess: false, message: "User Not Found" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({ sucess: false, message: error.message });
  }
};
