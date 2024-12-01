const app=require('./app');
const server=require('http').createServer(app);
const connectDB = require('./lib/db');

require('dotenv').config();



const PORT=process.env.PORT;

async function startServer()
{
    await connectDB();

    server.listen(PORT,()=>{
        console.log(`Server started on port ${PORT}`);
    });
    

}

startServer();

module.exports=server;