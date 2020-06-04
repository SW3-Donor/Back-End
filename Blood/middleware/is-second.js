const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = async (req, res, next) => {
  const secondpassword = req.body.secondpassword;

  const user = await User.findOne({ _id: req.userId });
  let isEqual;
  try {
    isEqual = await bcrypt.compare(secondpassword, user.secondpassword);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
  if (!isEqual) {
    const error = new Error("2차 비밀번호가 일치하지 않습니다.");
    next(error);
  }
  next();
};
