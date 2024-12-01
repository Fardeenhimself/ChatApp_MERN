const { StatusCodes } = require("http-status-codes");
const Message = require("../models/message.mode");
const User = require("../models/user.model");
require("../lib/utils");
const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket.io");

async function getUsersforSideBar(req, res) {
  const loggedInUserId = req.user.userId;

  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");

  res.status(200).json(filteredUsers);
}

async function httpGetMessages(req, res) {
  const { id: friendId } = req.params;
  const myId = req.user.userId;

  const messages = await Message.find({
    $or: [
      {
        senderId: myId,
        receiverId: friendId,
      },
      {
        senderId: friendId,
        receiverId: myId,
      },
    ],
  }).sort("createdAt");

  res.status(StatusCodes.OK).json(messages);
}

async function httpSendMessges(req, res) {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user.userId;
  let imageUrl;

  if (image) {
    const upload_image = await cloudinary.uploader.upload(image, {
      use_filename: true,
      folder: "chat-app",
    });
    imageUrl = upload_image.secure_url;
  }

  const newMessage = new Message({
    senderId: senderId,
    receiverId: receiverId,
    text: text,
    image: imageUrl,
  });

  await newMessage.save();
  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(StatusCodes.CREATED).json(newMessage);
}

module.exports = {
  getUsersforSideBar,
  httpGetMessages,
  httpSendMessges,
};
