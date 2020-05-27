const User = require("../models/user");
const Post = require("../models/post");

exports.showPosts = (req, res, next) => {
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find();
    })
    .then((posts) => {
      res.status(200).json({
        message: "제대로 가져옴",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.writePost = (req, res, next) => {
  let creator;
  const title = req.body.title;
  const content = req.body.content;
  const count = req.body.count;

  const post = new Post({
    creator: req.userId,
    title: title,
    content: content,
    count: count,
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "게시글 작성이 완료되었다.",
        post: post,
        creator: { _id: creator.id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      throw err;
    });
  next(err);
};

exports.showPostId = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("게시글을 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "게시글을 불러왔다.", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        throw err;
      }
      next(err);
    });
};

exports.updatePostId = (req, res, next) => {
  const postId = req.params.postId;
  post
    .findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("게시글을 찾을 수 없다.");
        error.statusCode = 404;
        throw error;
      }
      const title = req.body.title;
      const content = req.body.content;
      const count = req.body.count;

      if (post.creator.toString() !== req.userId) {
        const error = new Error("허가 안됌");
        error.statusCode = 403;
        throw error;
      }
      post.title = title;
      post.content = content;
      post.count = count;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "업데이트 완료", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        throw err;
      }
      next(err);
    });
};

exports.deletePostId = (req, res, next) => {
  const postId = req.params.postId;
  post
    .findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("게시글 없다.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("허가가 안됌");
        error.statusCode = 403;
        throw error;
      }
      return Post.findByIdAndRemove(post);
    })
    .then((result) => {
      res.status(200).json({ message: "삭제 완료" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        throw err;
      }
      next(err);
    });
};
