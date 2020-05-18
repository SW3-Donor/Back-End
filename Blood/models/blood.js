const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//헌혈증을 등록하는 모델 유저정보를 user테이블로부터 가져온다.

const bloodSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    validnumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: { currentTime: () => Date.now() + 3600000 * 9 } },
);

module.exports = mongoose.model("Blood", bloodSchema);
