const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token && req.headers?.token) {
      token = req.headers.token;
    }

    if (!token)
      return res.status(401).json({
        message: "Token missing",
      });

    let decode = jwt.verify(token, process.env.JWT_SECRET);
    let user = await UserModel.findById(decode.id);
    if (!user)
      return res.status(401).json({
        message: "Invalid token",
      });
    req.user = user;
    next();
  } catch (error) {
    console.log("error in middleware", error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;
