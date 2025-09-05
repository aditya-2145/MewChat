import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import Otp from "../models/otp.js"; // ✅ OTP model
import bcrypt from "bcryptjs";
import sendOTP from "../lib/utils.js"; // ✅ Function to send OTP

// Helper: Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ====================== SIGNUP (Step 1 - Send OTP) ======================
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Account already exists" });
    }

    // Clear any old OTPs for this email
    await Otp.deleteMany({ email });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP + user data temporarily
    await Otp.create({
      email,
      otp,
      fullName,
      password,
      bio,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
    });

    // Send OTP email
    await sendOTP(email, otp);

    res.json({
      success: true,
      message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ====================== VERIFY OTP (Step 2 - Create User) ======================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const record = await Otp.findOne({ email });
    if (!record) {
      return res.json({ success: false, message: "No OTP found" });
    }

    // Check expiry
    if (record.expiresAt < Date.now()) {
      await Otp.deleteOne({ email });
      return res.json({ success: false, message: "OTP expired" });
    }

    // Check OTP
    if (record.otp.toString().trim() !== otp.toString().trim()) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(record.password, salt);

    // Create new user
    const newUser = await User.create({
      fullName: record.fullName,
      email: record.email,
      password: hashedPassword,
      bio: record.bio,
    });

    // Delete OTP record
    await Otp.deleteOne({ email });

    // Generate token
    const token = generateToken(newUser._id);

    const { password: _, ...userWithoutPassword } = newUser._doc;

    res.json({
      success: true,
      userData: userWithoutPassword,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ====================== LOGIN ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);

    const { password: _, ...userWithoutPassword } = userData._doc;

    res.json({
      success: true,
      userData: userWithoutPassword,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ====================== CHECK AUTH ======================
export const checkAuth = (req, res) => {
  if (!req.user) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  const { _id, fullName, email, bio, profilePic } = req.user;
  res.json({
    success: true,
    user: { _id, fullName, email, bio, profilePic },
  });
};

// ====================== UPDATE PROFILE ======================
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    const { password: _, ...userWithoutPassword } = updatedUser._doc;

    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
