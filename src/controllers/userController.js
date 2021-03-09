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
    console.log("GET USERS BY ROOM ID");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getUserByRoomId, createNewUser };
