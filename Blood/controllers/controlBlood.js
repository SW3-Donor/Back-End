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

exports.bloodTrade = async (req, res, next) => {
  const sender = req.userId;
  const receiver = req.body.receiver;
  const count = parseInt(req.body.count);
  const changeblood = [];

  //sendUser 보내는 사람
  const sendUser = await User.findById({ _id: sender }); //헌혈증의 보낼 수 있는 개수 파악
  const receiveUser = await User.findOne({ email: receiver });
  const number = sendUser.bloods - count;
  try {
    if (number < 0) {
      const error = new Error(
        `보낼 수 있는 헌혈증의 개수는 ${sendUser.bloods}개 입니다.`,
      );
      error.statuscode = 401;
      throw error;
    }

    if (sendUser.email === receiver) {
      const error = new Error("나한테 헌혈증을 어떻게 보내니? 꺼뎌");
      error.statusCode = 401;
      throw error;
    }

    //헌혈증 보내기 bloods는 보내는 사람의 헌혈증
    let sendBloods = await Blood.find({ creator: sendUser._id });
    //recieveUser 받는사람

    //헌혈증 받는 유저 찾고 보내는 사람의 헌혈증 id를 바꿔준다.
    for (let i = 0; i < count; i++) {
      sendBloods[i].creator = receiveUser._id;
      changeblood.push(sendBloods[i]);
      await sendBloods[i].save();
    }
    sendBloods = await Blood.find({ creator: sendUser._id });
    // 보낸 사람의 헌혈증 소유 갯수를 바꿔준다.
    sendUser.bloods = sendBloods.length;
    await sendUser.save();
    //받는 사람 헌혈증 갯수를 바꿔준다.
    const receiveBloods = await Blood.find({ creator: receiveUser._id });
    receiveUser.bloods = receiveBloods.length;
    await receiveUser.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  req.sender = sendUser;
  req.receiver = receiveUser;
  req.changeblood = changeblood;
  next();
};

exports.bloodRecord = async (req, res, next) => {
  const changeblood = req.changeblood;
  const sender = req.sender;
  const receiver = req.receiver;
  let tradelog = [];
  try {
    for (let i = 0; i < changeblood.length; i++) {
      const tradeLog = new TradeLog({
        sender: sender.email,
        receiver: receiver.email,
        validnumber: changeblood[i].validnumber,
      });
      tradelog.push(await tradeLog.save());
    }
    res.status(200).json({
      message:
        "헌혈증 거래가 성공 하였습니다. 보내는건 기록과 각 유저 헌혈증 갯수입니다.",
      log: tradelog,
      sendUserlength: sender.bloods,
      receiveUserlength: receiver.bloods,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
