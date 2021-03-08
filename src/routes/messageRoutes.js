const { getMessages } = require("../controllers/messageController");

const routes = (app) => {
  app.route("/messages").get(getMessages);
};

module.exports = routes;
