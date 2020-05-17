const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("유효 하지않음");
    error.statusCode = 422;
    DOMError.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const name = req.body.name;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        phone: phone,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "회원가입이 완료되었습니다.", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loginUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error(
          "등록된 회원정보가 없습니다. 이메일을 확인해 주세요",
        );
      }
      loginUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loginUser.email,
          userId: loginUser._id.toString(),
        },
        "somesupersecretsecret",
        { expiresIn: "1h" },
      );
      res.status(200).json({ token: token, userId: loginUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};
