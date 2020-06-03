const { validationResult } = require("express-validator/check");
const Blood = require("../models/blood");
const User = require("../models/user");
const TradeLog = require("../models/tradeLog");

exports.bloodRegister = (req, res, next) => {
  const validnumber = req.body.number; //헌혈증번호
  console.log(validnumber);
  const creator = req.userId; //생성자
  let donorlength; //헌혈증 개수
  const blood = new Blood({
    creator: creator,
    validnumber: validnumber,
  });

  console.log("여기를 한번 찍어봐야겠다.");

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
      return Blood.find({ creator: donation.creator });
    })
    .then((blood) => {
      console.log("제발", creator);
      donorlength = blood.length;
      return User.findOne({ _id: creator });
    })
    .then((user) => {
      console.log("유저가존재하니?", user);
      user.bloods = donorlength;
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
      next(err);
    });
};

exports.bloodTrade = (req, res, next) => {
  secondPw(req, next);
  const sender = req.userId;
  const receiver = req.body.receiver;
  const count = req.body.count;
  const changeblood = [];
  let senderlength;
  let receiverlength;
  let number;
  let validnumber;

  User.findById({ _id: sender })
    .then((user) => {
      number = user.count - count;
      if (number < 0) {
        const error = new Error(
          `보낼 수 있는 헌혈증의 개수는 ${number}개 입니다.`,
        );
        error.statuscode = 401;
        throw error;
      }
      return Blood.find({ creator: user._id });
    })
    .then((bloods) => {
      for (i = 0; i < number; i++) {
        bloods[i].creator = receiver;
        changeblood.push(bloods[i]);
      }
      return bloods.save();
    })
    .then((success) => {
      Blood.find({ creator: sender }).then((sender) => {
        senderlength = sender.length;
      });
      Blood.find({ creator: receiver }).then((receiver) => {
        receiverlength = receiver.length;
      });
    })
    .then((result) => {
      res.status(201).json({
        message: "거래가 완료 되었습니다.",
        senderlength: senderlength,
        receiverlength: receiverlength,
      });
    })
    .then((trade) => {
      const tradeLog = new TradeLog({
        sender: sender,
        receiver: receiver,
        validnumber: validnumber,
      });
      changeblood.forEach((element) => {
        validnumber = element.validnumber;
        tradeLog.validnumber = validnumber;
        tradeLog.save();
      });
      return tradeLog;
    })
    .then((log) => {
      res.status(201).json({ message: "거래 목록입니다.", tradelog: tradeLog });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
