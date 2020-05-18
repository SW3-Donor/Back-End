const express = require("express");
const router = express.Router();

const Bloodcontrol = require("../controllers/controlBlood");

router.post("/register", Bloodcontrol.bloodRegister);

module.exports = rotuer;
