const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const {
  attachCookiesToResponse,
  validateRequiredFields,
} = require("../lib/utils");
const cloudinary = require("../lib/cloudinary");

async function httpLoginUser(req, res) {
  const { email, password } = req.body;
  validateRequiredFields(["email", "password"], req.body);

  const user = await User.findOne({ email });

  if (!user || !user.comparePassword(password)) {
    throw new Error("invalid Crendentials");
  }

  attachCookiesToResponse(user, res);

  res.status(StatusCodes.ACCEPTED).json({
    fullName: user.fullName,
    email: user.email,
    _id: user._id,
    profilePic: user.profilePic,
  });
}

async function httpRegisterUser(req, res) {
  const { fullName, email } = req.body;
  const user = await User.create(req.body);

  if (!user) throw new Error("will implement later");

  attachCookiesToResponse(user, res);
  res
    .status(StatusCodes.CREATED)
    .json({ fullName, email, _id: user._id, profilePic: user.profilePic });
}

function httpLogoutUser(req, res) {
  if (req.signedCookies.token) {
    throw new Error("You must be logged in to log out");
  }
  res.clearCookie("Token", { httpOnly: true });

  res.status(StatusCodes.OK).json({ msg: "you are logged out" });
}

function httpCheckAuth(req, res) {
  try {
    const userObj = {
      ...req.user,
      _id: req.user.userId,
    };

    delete userObj["userId"];

    res.status(StatusCodes.OK).json(userObj);
  } catch (e) {
    console.log("Error in checkAuth controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateProfilePic(req, res) {
  const { profilePic } = req.body;
  const { userId } = req.user;

  if (!profilePic) throw new Error("No profile pic provided");

  try {
    const cloudinary_url = await cloudinary.uploader.upload(profilePic, {
      use_filename: true,
      folder: "chat-app",
    });

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { profilePic: cloudinary_url.secure_url },
      { new: true }
    ).select("-password");
    res.status(StatusCodes.CREATED).json({ user });
  } catch (e) {
    throw new Error("Some error occured while uploading image", e);
  }
}

module.exports = {
  httpLoginUser,
  httpLogoutUser,
  httpRegisterUser,
  httpCheckAuth,
  updateProfilePic,
};
