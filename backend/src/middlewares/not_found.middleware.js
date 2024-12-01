const { StatusCodes } = require("http-status-codes");

function notFoundMiddleware(req,res)
{
    res.status(StatusCodes.NOT_FOUND).json({error:"Route does not exist"});
}


module.exports=notFoundMiddleware;