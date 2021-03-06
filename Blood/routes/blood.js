const express = require("express");
const router = express.Router();
const isToken = require("../middleware/is-auth");
const isSecond = require("../middleware/is-second");

const Bloodcontrol = require("../controllers/controlBlood");

router.post("/register", isToken, isSecond, Bloodcontrol.bloodRegister);

router.post(
  "/send",
  isToken,
  isSecond,
  Bloodcontrol.bloodTrade,
  Bloodcontrol.bloodRecord,
);

module.exports = router;
