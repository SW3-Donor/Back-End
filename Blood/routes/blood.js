const express = require("express");
const router = express.Router();
const isToken = require("../middleware/is-auth");

const Bloodcontrol = require("../controllers/controlBlood");

router.post("/register", isToken, Bloodcontrol.bloodRegister);

router.post("/send", isToken, Bloodcontrol.bloodTrade);

router.get("/test", (req, res, next) => {
  res.send("This is For TEST!!!!!!!!!!!!!!!");
});

module.exports = router;
