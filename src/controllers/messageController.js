const MessageModel = require("../models/MessageModel");
const multer = require("multer");
const cloudinary = require("../util/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "solocap",
    tags: (req) => req.params.roomName,
  },
});

const cloudMulter = multer({ storage: cloudStorage });

const getMessages = async (req, res, next) => {
  try {
    const messages = await MessageModel.find({
      roomId: req.params.roomId,
    }).populate("sender");
    res.status(200).send(messages);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getImgUrl = async (req, res, next) => {
  try {
    res.send({ imageUrl: req.file.path });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getMessages, getImgUrl, cloudMulter };
