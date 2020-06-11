const express = require("express");
const Authcontrol = require("../controllers/controlAuth");
const { body } = require("express-validator/check");

const router = express.Router();

router.post("/register", Authcontrol.register);

router.post("/password", Authcontrol.password);

router.post("/login", Authcontrol.login);

router.get("/test", (req, res, next) => {
  res.send("This is for TEST!");
});

// //kakao
// router.get("/kakao", passport.authenticate("kakao", {}));

// router.get("/kakao/callback", passport.authenticate("kakao", {}));

// router.get("/logout", (req, res, next) => {
//   console.log(req.user);
//   req.logout();
//   res.send(req.user);
// });
module.exports = router;
