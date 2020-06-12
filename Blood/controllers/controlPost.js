const User = require("../models/user");
const Post = require("../models/post");

exports.showPosts = async (req, res, next) => {
  let totalItems;
  try {
    const count = await Post.find().countDocuments();
    totalItems = count;
    const posts = await Post.find();

    res.status(200).json({
      message: "제대로 가져옴",
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

exports.writePost = async (req, res, next) => {
  const creator = req.userId;
  const title = req.body.title;
  const content = req.body.content;
  const count = req.body.count;

  const post = new Post({
    creator: creator,
    title: title,
    content: content,
    count: count,
  });
  try {
    await post.save();

    res.status(201).json({
      message: "게시글 작성이 완료되었다.",
      post: post,
      creator: { _id: creator.id, name: creator.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    next(err);
  }
};

exports.showPostId = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("게시글을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    res
      .status(200)
      .json({ message: "게시글 가져오기 성공 하였습니다.", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    next(err);
  }
};

exports.updatePostId = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = Post.findById(postId);
    if (!post) {
      const error = new Error("게시글을 찾을 수 없다.");
      error.statusCode = 404;
      throw error;
    }

    const { title } = req.body;
    const { content } = req.body;
    const { count } = req.body;

    if (post.creator.toString() !== req.userId) {
      const error = new Error("일치하지 않습니다 허가 안됨.");
      error.statusCode = 403;
      throw error;
    }
    post.title = title;
    post.content = content;
    post.count = count;
    await post.save();

    res
      .status(200)
      .json({ message: "게시글 수정 완료 하였습니다.", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    next(err);
  }
};

exports.deletePostId = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = Post.findById(postId);

    if (!post) {
      const error = new Error("게시글이 존재하지 않습니다.");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error("일치하지 않습니다 허가 안됨.");
      error.statusCode = 403;
      throw error;
    }

    await Post.findByIdAndRemove(post);
    res.status(200).json({ message: "삭제 완료" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    next(err);
  }
};
