const MessageModel = require("../models/MessageModel");

const getMessages = async (req, res, next) => {
  try {
    console.log("GET MESSAGES");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getMessages };
