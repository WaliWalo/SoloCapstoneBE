const Agenda = require("agenda");
const Room = require("../models/RoomModel");
const UserModel = require("../models/UserModel");
const moment = require("moment");
const Message = require("../models/MessageModel");

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_CONNECTION,
    options: { useUnifiedTopology: true },
  },
});

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
    const room = await Room.findById(req.params.roomId).populate("users");
    res.status(200).send(room.users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateScore = async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        $inc: { score: 1 },
      },
      { useFindAndModify: false, new: true }
    );
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const calculateDate = (createdAt) => {
  let date = moment(createdAt).add(1, "d").format();
  // date.replace("Moment<", "");
  return date;
};

agenda.define("delete old users", async () => {
  const users = await UserModel.find();

  users.forEach(async (user) => {
    if (calculateDate(user.createdAt) <= moment().format()) {
      await UserModel.findByIdAndDelete(user._id);
      await Room.deleteOne({ users: user });
      await Message.deleteMany({ sender: user._id });
    }
  });
});

(async function () {
  await agenda.start();

  await agenda.every("5 seconds", ["delete old users"]);
})();

module.exports = { getUserByRoomId, createNewUser, updateScore };
