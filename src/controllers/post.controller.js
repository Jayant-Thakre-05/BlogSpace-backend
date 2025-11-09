const PostModel = require("../models/post.model");

// Create a new post
const createPostController = async (req, res) => {
  try {
    let { title, content, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.status(422).json({
        message: "All fields are required",
      });
    }

    let newPost = await PostModel.create({
      title,
      content,
      authorId,
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "Post created",
      post: newPost,
    });
  } catch (error) {
    console.log("Error in create post controller ->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get posts by author
const getPostsByAuthorController = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await PostModel.find({ authorId: id });
    return res.status(200).json({ postsData: posts, message: "Posts by author fetched" });
  } catch (error) {
    console.log("Error in get posts by author controller ->", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all posts
const getAllPostsController = async (req, res) => {
  try {
    let posts = await PostModel.find();

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        message: "No posts found",
      });
    }

    return res.status(200).json({
      postsData: posts,
      message: "Posts fetched",
    });
  } catch (error) {
    console.log("Error in get all posts controller ->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get a post by ID
const getPostByIdController = async (req, res) => {
  try {
    let post_id = req.params.id;

    let post = await PostModel.findById(post_id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      postData: post,
      message: "Post fetched",
    });
  } catch (error) {
    console.log("Error in get post by ID controller ->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update a post
const updatePostController = async (req, res) => {
  try {
    let post_id = req.params.id;
    let { title, content } = req.body;

    let post = await PostModel.findById(post_id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    let updatedPost = await PostModel.findByIdAndUpdate(
      post_id,
      { title, content },
      { new: true }
    );


    if (!updatedPost) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }

    return res.status(200).json({
      message: "Post updated",
      updatedPost: updatedPost,
    });
  } catch (error) {
    console.log("Error in update post controller ->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Delete post (only by creator)
const deletePostController = async (req, res) => {
  try {
    let post_id = req.params.id;

    let post = await PostModel.findById(post_id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    await PostModel.findByIdAndDelete(post_id);

    return res.status(200).json({
      message: "Post deleted",
      deletedPost: post,
    });
  } catch (error) {
    console.log("Error in delete post controller ->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


module.exports = {
  createPostController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController,
  getPostsByAuthorController,
};