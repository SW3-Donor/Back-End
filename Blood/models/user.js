const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  blood: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blood",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
