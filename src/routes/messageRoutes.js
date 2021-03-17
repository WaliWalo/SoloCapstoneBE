const {
  getMessages,
  getImgUrl,
  cloudMulter,
} = require("../controllers/messageController");

const routes = (app) => {
  app.route("/messages/:roomId").get(getMessages);

  app
    .route("/messages/image/:roomName")
    .post(cloudMulter.single("picture"), getImgUrl);
};

module.exports = routes;
