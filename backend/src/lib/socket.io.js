const {Server}=require('socket.io');
const server=require('../server');

const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

function getReceiverSocketId(userId)
{
    return userSocketMap[userId];
}

const userSocketMap={};


io.on('connection',(socket)=>{
    console.log('A user connected',socket.id);

    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap)); 
    });
});

module.exports={
    getReceiverSocketId,
    io
}