const express = require("express");
const router = express.Router();
const isToken = require("../middleware/is-auth");
const PostControl = require("../controllers/controlPost");

//게시글 가져오기
router.get("/posts", isToken, PostControl.showPosts);

//게시글 작성
router.post("/post", isToken, PostControl.writePost);

//게시글 상세보기
router.get("/post:postId", isToken, PostControl.showPostId);

//게시글 수정하기
router.put("/post:postId", isToken, PostControl.updatePostId);

//게시글 지우기
router.delete("/post:postId", isToken, PostControl.deletePostId);

module.exports = router;
