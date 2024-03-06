const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  likes: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("post", postSchema);
