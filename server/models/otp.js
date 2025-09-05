import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  expiresAt: { type: Date, required: true },
});

// Optional: Add TTL index to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
