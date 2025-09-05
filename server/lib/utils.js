import jwt from "jsonwebtoken";

//function to generate a token from a user
export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  return token;
};

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // <-- App Password, not your Gmail password
  },
});

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"MewChat" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "MewChat - Verify your email",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `<h2>Your OTP is: <b>${otp}</b></h2><p>It expires in 5 minutes.</p>`,
    });
    console.log(`OTP sent to ${email}`);
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    throw new Error("Failed to send OTP. Please try again.");
  }
};

export default sendOTP;
