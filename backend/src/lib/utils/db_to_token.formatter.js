function dbToTokenFormatter(user)
{
    return {userId:user._id,fullName:user.fullName};
}

module.exports=dbToTokenFormatter;