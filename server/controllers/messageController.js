//get all users except the logged in user
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import { io, userSocketMap } from "../server.js";
import User from "../models/user.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // count no. msg not seen
    const unseenMessages = {};
    const promises = filteredUser.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({ success: true, users: filteredUser, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//get all msg for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // Convert ObjectIds to strings to avoid conversion errors
    const myIdString = myId.toString();
    const selectedUserIdString = selectedUserId.toString();

    const messages = await Message.find({
      $or: [
        {
          senderId: myIdString,
          receiverId: selectedUserIdString,
        },
        {
          senderId: selectedUserIdString,
          receiverId: myIdString,
        },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time

    // Mark messages as seen (fixed typo: seletedUserId -> selectedUserId)
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//api to mark message as seen using msg id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    // Fixed typo: send -> seen
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    // Fixed: req.params should be req.params.id
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl; // Fixed variable name consistency
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl, // Fixed variable name
    });

    // emit the new msg to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
