const { validationResult } = require("express-validator/check");
const Blood = require("../models/blood");
const User = require("../models/user");
const TradeLog = require("../models/tradeLog");

exports.bloodRegister = (req, res, next) => {
  const validnumber = req.body.number; //헌혈증번호
  const creator = req.userId; //생성자
  let donorlength; //헌혈증 개수
  const blood = new Blood({
    creator: creator,
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
      return Blood.find({ creator: donation.creator });
    })
    .then((blood) => {
      donorlength = blood.length;
      return User.findOne({ _id: creator });
    })
    .then((user) => {
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
  const sender = req.userId;
  let receiver = req.body.receiver;
  const count = parseInt(req.body.count);
  const changeblood = [];
  let senderlength;
  let receiverlength;
  let number;
  let validnumber;

  User.findById({ _id: sender })
    .then((user) => {
      number = user.bloods - count;
      if (number < 0) {
        const error = new Error(
          `보낼 수 있는 헌혈증의 개수는 ${user.bloods}개 입니다.`,
        );
        error.statuscode = 401;
        throw error;
      }
      return Blood.find({ creator: user._id });
    })
    .then((bloods) => {
      User.findOne({ email: receiver })
        .then((user) => {
          return (receiver = user._id);
        })
        .then((id) => {
          for (let i = 0; i < count; i++) {
            bloods[i].creator = id;
            changeblood.push(bloods[i]);
            bloods[i].save();
          }
        });
      return Blood.find();
    })
    .then((success) => {
      console.log("이것이 무엇인가", success);
      Blood.find({ creator: sender })
        .then((send) => {
          senderlength = send.length;
          User.findById({ _id: sender }).then((user) => {
            user.bloods = senderlength;
            return user.save();
          });
        })
        .then((result) => {
          Blood.find({ creator: receiver }).then((get) => {
            receiverlength = get.length;
            User.findById({ _id: receiver }).then((user) => {
              user.bloods = receiverlength;
              return user.save();
            });
          });
        });
    })
    .then((trade) => {
      console.log("너는값이 있니", trade);
      const tradeLog = new TradeLog({
        sender: sender,
        receiver: receiver,
        validnumber: validnumber,
      });
      for (let i = 0; let < changeblood.length; i++) {}
      changeblood.forEach((element) => {
        validnumber = element.validnumber;
        tradeLog.validnumber = validnumber;
        tradeLog.save();
      });
      return tradeLog;
    })
    .then((log) => {
      res.status(201).json({
        message: "거래가 성공하였습니다, 거래 목록입니다.",
        tradelog: log,
        senderlength: senderlength,
        receiverlength: receiverlength,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
