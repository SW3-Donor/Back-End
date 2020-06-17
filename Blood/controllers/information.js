const User = require("../models/user");
const TradeLog = require("../models/tradeLog");
const Blood = require("../models/blood");

exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const email = user.email;
    const name = user.name;
    const bloods = user.bloods;
    const phone = user.phone;
    const sended = await TradeLog.find({ sender: email });
    const received = await TradeLog.find({ receiver: email });
    const blood = await Blood.find({ creator: req.userId });

    res.status(201).json({
      message: "유저 정보와 거래 기록입니다.",
      email: email,
      name: name,
      count: bloods,
      phone: phone,
      sendtrade: sended,
      receivetrade: received,
      myblood: blood,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
