const express = require("express");
const Authcontrol = require("../controllers/controlAuth");
const { body } = require("express-validator/check");

const router = express.Router();

router.post(
  "/register",
  // [
  //   body("email")
  //     .isEmail()
  //     .withMessage("Please enter a valid email.")
  //     .custom((value, { req }) => {
  //       return User.findOne({ email: value }).then((userDoc) => {
  //         if (userDoc) {
  //           return Promise.reject("E-mail address already exists!");
  //         }
  //       });
  //     })
  //     .normalizeEmail(),
  //   body("password").trim().isLength({ min: 5 }),
  //   body("name").trim().not().isEmpty(),
  // ],
  Authcontrol.register,
);

router.post("/login", Authcontrol.login);

router.get("/test", (req, res, next) => {
  res.send("This is for TEST!");
});

module.exports = router;
