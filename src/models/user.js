const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    study: { type: Number },
    work: { type: Number },
    hobbies: { type: Number },
  },
  { collection: "user-data" }
);

module.exports = mongoose.model("User", userSchema);
