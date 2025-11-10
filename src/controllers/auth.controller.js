const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    let existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    let newUser = await UserModel.create({
      name,
      email,
      password,
    });

    let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User registered",
      user: newUser,
    });
  } catch (error) {
    console.log("error in registration->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    let user = await UserModel.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    let comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass)
      return res.status(401).json({
        message: "Invalid Credentials",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "user logged in",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    let token = req.cookies.token;

    if (!token)
      return res.status(404).json({
        message: "Token not found",
      });

    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    };

    res.clearCookie("token", cookieOptions);
    return res.status(200).json({
      message: "user logged out",
    });
  } catch (error) {
    console.log("error in logout", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
};