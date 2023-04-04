const { Schema, model } = require("mongoose");

const Users = new Schema({
  username: {
    type: String,
    require: true,
  },
  instagramSubscribers: {
    type: Number,
  },
  twitterSubscribers: {
    type: Number,
  },
  facebookSubscribers: {
    type: Number,
  },
});

module.exports = model("Users", Users);
