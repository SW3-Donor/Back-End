const { validationResult } = require("express-validator/check");
const Blood = require("../models/blood");
const User = require("../models/user");

exports.bloodRegister = (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error("유효하지 않습니다.");
  //   error.statusCode = 422;
  //   throw error;
  // }
  const validnumber = req.body.number; //헌혈증번호
  let register;
  let donorLength;

  const blood = new Blood({
    validnumber: validnumber,
    register: req.userId,
  });
  blood
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      register = user;
      user.bloods.push(blood);
      return user.save();
    })
    .then((result) => {
      donorLength = result.bloods.length;
      res.status(201).json({
        message: "등록이 완료되었습니다.",
        blood: blood,
        register: { _id: register._id, name: register.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};
