const { validationResult } = require("express-validator/check");
const Blood = require("../models/blood");
const User = require("../models/user");

exports.bloodRegister = (req, res, next) => {
  const validnumber = req.body.number; //헌혈증번호
  console.log("number: ", req.body.number);
  let creator; //생성자
  let donorlength; //헌혈증 개수
  console.log(req.userId);
  const blood = new Blood({
    creator: req.userId,
    validnumber: validnumber,
  });
  Blood.findOne({ validnumber: validnumber })
    .then((isEqual) => {
      if (isEqual) {
        const error = new Error("이미 존재하는 번호 입니다.");
        error.statusCode = 401;
        throw error;
      }
      return blood.save();
    })
    .then((donation) => {
      console.log(donation.creator);
      return Blood.find({ creator: donation.creator });
    })
    .then((blood) => {
      donorlength = blood.length;
      console.log(donorlength);
      creator = req.userId;
      return User.findOne({ _id: creator });
    })
    .then((user) => {
      user.bloods = donorlength;
      console.log(user.bloods);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "헌혈증 등록이 완료되었습니다.",
        blood: blood,
        donorlength: donorlength,
        creator: { _id: creator._id, name: creator.name, count: donorlength },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        throw err;
      }
    });
};
