const fs = require("fs");
const { validationResult } = require("express-validator/check");

const io = require("../socket");
const Post = require("../models/post");
const path = require("path");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1; //query parameter from query object
  const perPage = 2;
  let totalItems;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Success Fetched posts.",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, Enterd data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  let creator;

  const post = new Post({
    title: title,
    content: content,
    creator: req.userId,
    imageUrl: imageUrl,
  });
  try {
    const user = await User.findById(req.userId);
    creator = user; //req.userId를 통해서 user를 찾으면 creator에 저장
    const newpost = await post.save();
    await user.posts.push(newpost);
    user.save();
    io.getIO().emit("posts", {
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    });

    res.status(201).json({
      message: "Post created successfully",
      post: post,
      creator: { _id: creator._id, name: creator.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPostId = (req, res, next) => {
  const postId = req.params.postId; //match 해야한다 나의 라우트의 post:/postId이것과
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find Post.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Success fetched post.", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = async (req, res, next) => {
  const postkey = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error;
  }
  try {
    const postId = await Post.findById(postkey).populate("creator");

    if (!postId) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (postId.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== postId.imageUrl) {
      clearImage(postId.imageUrl);
    }
    postId.title = title;
    postId.imageUrl = imageUrl;
    postId.content = content;
    const result = await postId.save();
    io.getIO().emit("posts", { action: "update", post: result });

    res.status(200).json({ message: "Post updated!", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted Post." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
