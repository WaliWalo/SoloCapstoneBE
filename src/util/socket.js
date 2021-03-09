const RoomModel = require("../models/RoomModel");
const User = require("../models/UserModel");

const createRoom = async (user) => {
  try {
    const newRoom = new RoomModel(user);
    const room = await newRoom.save();
    return room;
  } catch (error) {
    console.log(error);
  }
};

const checkIfRoomExists = async (roomName) => {
  try {
    const room = await RoomModel.find({ roomName });
    if (room.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const addUserToRoom = async ({ userId, roomName }) => {
  try {
    const room = await RoomModel.findOneAndUpdate(
      { roomName },
      { $addToSet: { users: userId } },
      { useFindAndModify: false }
    );
    return room;
  } catch (error) {
    console.log(error);
  }
};

const checkIfUserTurn = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.turn) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  checkIfUserTurn,
  createRoom,
  checkIfRoomExists,
  addUserToRoom,
};
