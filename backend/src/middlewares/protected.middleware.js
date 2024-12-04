const { verifyJWT } = require("../lib/utils");


function protectedRoute(req,res,next)
{
    
    const token=req.signedCookies.Token;
    console.log(req.signedCookies.Token);
    

    if(!token)
        throw new Error("You are not logged in");

    try{
        const decoded=verifyJWT(token);

        req.user=decoded;
    }
    catch(e)
    {
        throw new Error("Invalid crendentials");
    }
    next();

}


module.exports=protectedRoute;