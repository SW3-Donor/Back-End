const express = require("express");
const Authcontrol = require("../controllers/controlAuth");

const router = express.Router();

router.get("/register", Authcontrol.register);

module.exports = router;
