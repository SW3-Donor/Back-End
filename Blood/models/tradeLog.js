const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tradeSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    validnumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: { currentTime: () => Date.now() + 3600000 * 9 } },
);

module.exports = mongoose.model("Log", tradeSchema);
