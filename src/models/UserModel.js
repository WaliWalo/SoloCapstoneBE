const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    creator: { type: String, required: true },
    turn: { type: Boolean },
  },
  { timestampe: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
