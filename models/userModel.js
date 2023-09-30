const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
