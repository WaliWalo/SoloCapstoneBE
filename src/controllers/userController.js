const Room = require("../models/RoomModel");
const UserModel = require("../models/UserModel");

const createNewUser = async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(200).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserByRoomId = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    res.status(200).send(room.users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getUserByRoomId, createNewUser };
