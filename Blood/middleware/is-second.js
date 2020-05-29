const User = require("../models/user");

module.exports = (req, next) => {
  const secondpassword = req.body.secondpassword;

  if (!secondpassword || secondpassword === "-1") {
    const error = new Error("2차비번을 설정해주세요");
    error.statusCode = 404;
    throw error;
  }
  User.findOne({ _id: req.userId })
    .then((user) => {
      console.log(user.secondpassword);
      return bcrypt.compare(secondpassword, user.secondpassword);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("2차 비밀번호가 일치하지 않습니다.");
        error.statusCode = 401;
        throw error;
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
