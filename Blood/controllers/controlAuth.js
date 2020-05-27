const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const name = req.body.name;
  User.findOne({ email: email })
    .then((isEqual) => {
      if (isEqual) {
        const error = new Error("이미 가입 되어있는 이메일 입니다.");
        error.statusCode = 401;
        throw error;
      }
      return bcrypt.hash(password, 12);
    })
    .then((result) => {
      const user = new User({
        email: email,
        password: result,
        name: name,
        phone: phone,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};

exports.password = (req, res, next) => {
  const password = req.body.password;
  const userId = req.body.userId;
  return bcrypt
    .hash(password, 12)
    .then((hashPw) => {
      User.findById(userId)
        .then((user) => {
          user.secretpassword = hashPw;
          return user.save();
        })
        .then((result) => {
          res.status(201).json({
            message: "회원가입 등록이 완료 되었습니다.",
            userId: result._id,
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
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
      next(err);
    });
};
