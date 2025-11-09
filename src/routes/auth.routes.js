const express = require("express");
const router = express.Router();

const { registerController, loginController, logoutController } = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", authMiddleware, logoutController);

module.exports = router;
