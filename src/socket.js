const socketio = require("socket.io");
const {} = require("./util/socket");
const MessageModel = require("./models/MessageModel");

const createSocketServer = (server) => {
  const io = socketio(server);
  io.on("connection", (socket) => {
    console.log(`New socket connection --> ${socket.id}`);

    socket.on("createRoom", ({ userId }) => {
      // Create room with userid
      // join room(random alphabet)
      // socket emit back room name
    });

    socket.on("joinRoom", ({ userId, roomId }) => {
      //Get user id and room(random alphabet) from fe,
      //join room
      //broadcast to room user joined
      //add user to room in database
    });

    socket.on("startGame", () => {
      //broadcast to room game is starting
      //update room in database, change started to true
    });

    socket.on("spinWheel", () => {
      //return random user on spin
    });

    socket.on("onSelect", ({ selection }) => {
      //broadcast selection to room
    });

    socket.on("onQuestionSelect", ({ question, userId }) => {
      //set current user.turn to false
      //selectedUser = currentRoom.users.findIndex(currentUser._id)
      //nextUser = currentRoom.users[selectedUser+1]
      //findByIdAndUpdate(nextUser,{turn:true})
      //socket.broadcast.to(room).emit({nextUser, question})
    });

    socket.on("endGame", ({ userId }) => {
      //find room where creator = user id
      //for each users in room
      //delete the user from User Model
      //delete message where room id === current room from Message Model
      //then delete current room from Room Model
    });

    socket.on("sendMessage", (message) => {
      //broadcast message to room
      //add message to database
    });

    socket.on("disconnect", (reason) => {
      console.log(reason);
    });
  });
};

module.exports = createSocketServer;
