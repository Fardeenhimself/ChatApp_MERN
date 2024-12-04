const jwt=require('jsonwebtoken');
require('dotenv').config();

function createJWT(user)
{
    const JWT_SECRET=process.env.JWT_SECRET;
    return jwt.sign({...user},JWT_SECRET,{expiresIn:"7d"});


}

function verifyJWT(token)
{
    const JWT_SECRET=process.env.JWT_SECRET;
    return jwt.verify(token,JWT_SECRET);
}


module.exports={createJWT,verifyJWT};