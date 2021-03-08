const {
  getUserByRoomId,
  createNewUser,
} = require("../controllers/userController");

const routes = (app) => {
  app.route("/users/:roomId").get(getUserByRoomId);
  app.route("/users").post(createNewUser);
};

module.exports = routes;
