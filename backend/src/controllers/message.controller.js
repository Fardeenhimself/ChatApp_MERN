const { StatusCodes } = require('http-status-codes');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const cloudinary = require('../lib/cloudinary');
const { getReceiverSocketId, io } = require('../lib/socket.io'); // Import both

async function getUsersforSideBar(req, res) {
    const loggedInUserId = req.user.userId;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

    res.status(200).json(filteredUsers);
}

async function httpGetMessages(req, res) {
    const { id: friendId } = req.params;
    const myId = req.user.userId;

    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: friendId },
            { senderId: friendId, receiverId: myId },
        ]
    }).sort('createdAt');

    res.status(StatusCodes.OK).json(messages);
}

async function httpSendMessages(req, res) {
    console.log(io);
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;
    let imageUrl;

    try {
        if (image) {
            const upload_image = await cloudinary.uploader.upload(image, {
                use_filename: true,
                folder: 'chat-app',
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

        // Emit to receiver via socket.io if they are connected
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage); // Use io to emit message
        } else {
            console.log(`Receiver with ID ${receiverId} is not connected`);
        }

        res.status(StatusCodes.CREATED).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error sending message' });
    }
}

module.exports = {
    getUsersforSideBar,
    httpGetMessages,
    httpSendMessages,
};
