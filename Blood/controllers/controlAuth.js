const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.password = async (req, res, next) => {
  const password = req.body.secondpassword;
  const userId = req.body.userId;

  try {
    const hashPw = await bcrypt.hash(password, 12);
    const user = await User.findById(userId);
    user.secondpassword = hashPw;
    await user.save();
    res.status(201).json({
      message: "회원가입 등록이 완료 되었습니다.",
      userId: user._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.register = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const name = req.body.name;

  try {
    const alreadyUser = await User.findOne({ email: email });
    if (alreadyUser) {
      const error = new Error("이미 가입되어 있는 메일입니다.");
      throw error;
    }
    const result = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: result,
      name: name,
      phone: phone,
      secondpassword: "-1",
      bloods: 0,
    });
    await user.save();
    res.status(201).json({
      message: "회원가입이 완료 되었다.",
      userId: user._id,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loginUser;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error(
        "등록된 회원정보가 없습니다. 이메일을 확인해 주세요",
      );
      throw error;
    }

    loginUser = user;
    const isEqual = bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
      error.statusCode = 401;
      throw error;
    }

    const token = await jwt.sign(
      {
        email: loginUser.email,
        userId: loginUser._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" },
    );
    res.status(200).json({
      message: "로그인에 성공 하였습니다",
      token: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
