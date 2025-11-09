const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token)
      return res.status(404).json({
        message: "Token not found",
      });
let decode = jwt.verify(token, process.env.JWT_SECRET);
    let user = await UserModel.findById(decode.id);
    if (!user)
      return res.status(400).json({
        message: "Invalid token",
      });
    req.user = user;
    next();
  } catch (error) {
    console.log("error in middleware", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = authMiddleware;
