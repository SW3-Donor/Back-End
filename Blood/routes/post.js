const express = require("express");
const router = express.Router();
const isToken = require("../middleware/is-auth");
const PostControl = require("../controllers/controlPost");

router.get("/posts", isToken, PostControl.showPosts);

router.post("/post", isToken, PostControl.writePost);

router.get("/post:postId", isToken, PostControl.showPostId);

router.put("/post:postId", isToken, PostControl.updatePostId);

router.delete("/post:postId", isToken, PostControl.deletePostId);

module.exports = router;
