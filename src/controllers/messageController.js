const MessageModel = require("../models/MessageModel");

const getMessages = async (req, res, next) => {
  try {
    const messages = await MessageModel.find();
    res.status(200).send(messages);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getMessages };
