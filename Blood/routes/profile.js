const isToken = require("../middleware/is-auth");
const express = require("express");
const router = express.Router();
const information = require("../controllers/information");

router.post("/user", isToken, information.profile);

module.exports = router;
