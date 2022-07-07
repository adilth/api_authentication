const mongoose = require("mongoose");

const AuthSchma = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
    min: 6,
  },
  email: {
    type: "String",
    required: true,
  },
  password: {
    type: "String",
    required: true,
    min: 8,
  },
  token: { type: String },
  role: {
    type: "String",
    default: "basic",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Auth", AuthSchma);
