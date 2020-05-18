const express = require("express");
const router = express.Router();

const Bloodcontrol = require("../controllers/controlBlood");

router.post("/register", Bloodcontrol.bloodRegister);

router.get("/test", (req, res, next) => {
  res.send("TEST!!!!!!!!!!!!!!!");
});

module.exports = router;
