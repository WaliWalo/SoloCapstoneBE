const {
  getUserByRoomId,
  createNewUser,
  updateScore,
} = require("../controllers/userController");

const routes = (app) => {
  app.route("/users/:roomId").get(getUserByRoomId);
  app.route("/users").post(createNewUser);
  app.route("/users/score/:userId").put(updateScore);
};

module.exports = routes;
