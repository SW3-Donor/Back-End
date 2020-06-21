const Blood = require("../models/blood");
const User = require("../models/user");
const TradeLog = require("../models/tradeLog");
const Post = require("../models/post");

exports.bloodRegister = async (req, res, next) => {
  const validnumber = req.body.number; //헌혈증번호
  const creator = req.userId; //생성자
  const blood = new Blood({
    creator: creator,
    validnumber: validnumber,
  });

  try {
    const isEqual = await Blood.findOne({ validnumber: validnumber });

    if (isEqual) {
      const error = new Error("이미 존재하는 번호 입니다.");
      error.statusCode = 401;
      throw error;
    }
    const donation = await blood.save();
    const donor = await Blood.find({ creator: donation.creator });
    const donorlength = donor.length;

    const user = await User.findOne({ _id: creator });
    user.bloods = donorlength;
    await user.save();

    res.status(201).json({
      message: "헌혈증 등록이 완료되었습니다.",
      blood: blood,
      donorlength: donorlength,
      creator: { _id: creator._id, name: creator.name, count: donorlength },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.bloodTrade = async (req, res, next) => {
  //게시글로 보내는 경우
  if (req.body.postId) {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    const receiver = post.creator;
    const receiveUser = await User.findById({ _id: receiver });

    await tradeBlood(req, postId, receiveUser, next);

    // 그냥 헌혈증 보내는경우
  } else {
    const receiver = req.body.receiver;
    const receiveUser = await User.findOne({ email: receiver });
    postId = null;

    await tradeBlood(req, postId, receiveUser, next);
  }
};

exports.bloodRecord = async (req, res, next) => {
  const changeblood = req.changeblood;
  const sender = req.sender;
  const receiver = req.receiver;
  const postId = req.postId;
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
    if (postId != null) {
      const post = await Post.findById(postId);
      post.received = changeblood.length;
      await post.save();
      res.status(200).json({
        message:
          "헌혈증 거래가 성공 하였습니다. 보내는건 기록과 각 유저 헌혈증 갯수입니다.",
        log: tradelog,
        sendUserlength: sender.bloods,
        receiveUserlength: receiver.bloods,
        received: changeblood.length,
      });
    } else {
      res.status(200).json({
        message:
          "헌혈증 거래가 성공 하였습니다. 보내는건 기록과 각 유저 헌혈증 갯수입니다.",
        log: tradelog,
        sendUserlength: sender.bloods,
        receiveUserlength: receiver.bloods,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

async function tradeBlood(req, postId, receiveUser, next) {
  const sender = req.userId;
  const count = parseInt(req.body.count);
  const changeblood = [];
  const sendUser = await User.findById(sender); //헌혈증의 보낼 수 있는 개수 파악
  const number = sendUser.bloods - count;

  //sendUser 보내는 사람
  try {
    if (number < 0) {
      const error = new Error(
        `보낼 수 있는 헌혈증의 개수는 ${sendUser.bloods}개 입니다.`,
      );
      error.statuscode = 401;
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
  req.postId = postId;
  next();
}
