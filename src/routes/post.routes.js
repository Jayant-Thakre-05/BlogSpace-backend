const express = require("express");
const router = express.Router();    

const { createPostController, getAllPostsController, getPostByIdController, updatePostController, deletePostController, getPostsByAuthorController } = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/create", authMiddleware, createPostController);
router.get("/getall", getAllPostsController);
router.get("/get/:id", getPostByIdController);
router.get("/user/:id", getPostsByAuthorController);
router.put("/update/:id", authMiddleware, updatePostController);
router.delete("/delete/:id", authMiddleware, deletePostController);

module.exports = router;