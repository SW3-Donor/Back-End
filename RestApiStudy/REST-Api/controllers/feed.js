const fs = require("fs");
const { validationResult } = require("express-validator/check");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ message: "Success Fetched posts.", posts: posts });
    })
    .catch((err) => {
      errorStatus();
    });
};

exports.createPost = (req, res, next) => {
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
  const post = new Post({
    title: title,
    content: content,
    creator: { name: "DOHYUN SOUNG" },
    imageUrl: imageUrl,
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully",
        post: result,
      });
    })
    .catch((err) => {
      errorStatus();
    });
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
      errorStatus();
    });
};

exports.putPostId = (req, res, next) => {
  const postId = req.params.postId;
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
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        DeleteImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Success Post updated!" });
    })
    .catch((err) => {
      errorStatus();
    });
};

function errorStatus() {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next();
}

const DeleteImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
