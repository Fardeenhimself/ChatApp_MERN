const dbToTokenFormatter = require("./db_to_token.formatter");
const { createJWT } = require("./jwt");

function attachCookiesToResponse(user,res)
{
    const formattedUser=dbToTokenFormatter(user);
    const token=createJWT(formattedUser);

    res.cookie("Token",token,{maxAge:1000*60*60,signed:true,httpOnly:true});

}



module.exports=attachCookiesToResponse;