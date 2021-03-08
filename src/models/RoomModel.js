const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoomSchema = new Schema(
  {
    users: [{ type: mongoose.ObjectId, ref: "User", required: true }],
    roomType: { type: String, required: true },
    ended: { type: Boolean },
    started: { type: Boolean },
  },
  { timestampe: true }
);

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
