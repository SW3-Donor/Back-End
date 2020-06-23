const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    count: {
      type: String,
      required: true,
    },
    received: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      ref: "User",
    },
    email: {
      type: String,
      require: true,
    },
  },
  { timestamps: { currentTime: () => Date.now() + 3600000 * 9 } },
);

module.exports = mongoose.model("Post", postSchema);
