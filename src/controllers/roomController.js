const Room = require("../models/RoomModel");

const getRoomByUserId = async (req, res, next) => {
  try {
    const room = await Room.findOne({ users: req.params.userId });
    res.status(200).send(room);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getRoomByUserId };
