const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const messageRoutes = require("./routes/messageRoutes");
const roomRoutes = require("./routes/roomRoutes");

const http = require("http");
const createSocketServer = require("./socket");

const {
  notFoundHandler,
  notAuthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const server = express();
const httpServer = http.createServer(server);
createSocketServer(httpServer);

const whitelist = [`${process.env.REACT_APP_FE_URL}`];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const port = process.env.PORT;
server.use(cors(corsOptions));

server.use(express.json());

userRoutes(server);
questionRoutes(server);
messageRoutes(server);
roomRoutes(server);

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestHandler);
server.use(notAuthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    httpServer.listen(port, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
