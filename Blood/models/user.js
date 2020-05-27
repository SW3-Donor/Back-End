const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bloods: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    secretpassword: {
      type: String,
    },
  },
  { timestamps: { currentTime: () => Date.now() + 3600000 * 9 } },
);

module.exports = mongoose.model("User", userSchema);
