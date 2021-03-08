const UserModel = require("../models/UserModel");

const createNewUser = async (req, res, next) => {
  try {
    console.log("CREATE NEW USER");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserByRoomId = async (req, res, next) => {
  try {
    console.log("GET USERS BY ROOM ID");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getUserByRoomId, createNewUser };
