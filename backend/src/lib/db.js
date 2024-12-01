const mongoose=require('mongoose');
require('dotenv').config();

mongoose.connection.on('open',()=>{
    console.log("connected to MONGODB: "+mongoose.connection.host);
    
});

mongoose.connection.on('error',(err)=>{
    console.log("Error connecting to DATABASE. ERROR:" +err);
});


async function connectDB()
{

    return await mongoose.connect(process.env.MONGO_URL);
    // try
    // {
    //     const conn=await mongoose.connect(process.env.MONGO_URL);
    //     console.log("connected to MONGODB: "+conn.connection.host);

    // }
    // catch(err)
    // {
    //     console.log("Error connecting to DATABASE. ERROR:" +err);
    // }

    


}

module.exports=connectDB;

