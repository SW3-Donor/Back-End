const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bloodSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  validnumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Blood", bloodSchema);
