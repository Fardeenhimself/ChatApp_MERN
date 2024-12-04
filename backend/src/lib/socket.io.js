// lib/socket.js
const { Server } = require('socket.io');
const io = new Server();

function initializeSocket(server) {
    io.attach(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    console.log('Socket.io initialized');
}

const userSocketMap = {};

function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

module.exports = { io, initializeSocket, getReceiverSocketId };
