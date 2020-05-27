const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tradeSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    validnumber: {
      type: Schema.Types.ObjectId,
      ref: "Blood",
      required: true,
    },
  },
  { timestamps: { currentTime: () => Date.now() + 3600000 * 9 } },
);

module.exports = mongoose.model("Log", tradeSchema);
