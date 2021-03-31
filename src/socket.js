const socketio = require("socket.io");
const {
  createRoom,
  checkIfRoomExists,
  addUserToRoom,
  checkIfUserTurn,
} = require("./util/socket");
const MessageModel = require("./models/MessageModel");
const RoomModel = require("./models/RoomModel");
const randomChar = require("random-char");
const User = require("./models/UserModel");
const Room = require("./models/RoomModel");
const Message = require("./models/MessageModel");
const multer = require("multer");
const cloudinary = require("./util/cloudinaryConfig");

const createSocketServer = (server) => {
  const io = socketio(server);
  io.on("connection", (socket) => {
    console.log(`New socket connection --> ${socket.id}`);
    //check if user is in any room, if it is let socket join the room

    socket.on("userConnected", async ({ userId }) => {
      const rooms = await RoomModel.find({ users: userId });
      if (rooms.length > 0) {
        socket.join(rooms[0].roomName);
      }
    });

    socket.on("createRoom", async ({ userId, roomType }) => {
      // Create room with userid
      let roomName = "";
      let rooms = [];
      do {
        for (let i = 0; i < 6; i++) {
          roomName += randomChar({ upper: true });
        }
        rooms = await RoomModel.find({ roomName });
      } while (rooms.length !== 0);

      const newRoom = await createRoom({
        users: [userId],
        roomType,
        ended: false,
        started: false,
        roomName,
      });
      // join room(random alphabet)
      socket.join(roomName);
      // socket emit back room name
      socket.emit("roomName", newRoom);
    });

    socket.on("joinRoom", async ({ userId, roomName }) => {
      //Get user id and room(random alphabet) from fe,
      const roomExist = await checkIfRoomExists(roomName);

      if (roomExist) {
        //join room
        //broadcast to room user joined
        //add user to room in database
        await addUserToRoom({ userId, roomName });
        socket.join(roomName);
        socket.emit("roomExist", { status: "ok", msg: "Room exist" });
        io.in(roomName).emit("userJoined", { userId });
      } else {
        socket.emit("roomExist", {
          status: "error",
          msg: "Room does not exist",
        });
      }
    });

    socket.on("startGame", async ({ userId, roomName }) => {
      //broadcast to room game is starting
      //update room in database, change started to true
      const user = await User.findById(userId);
      if (user.creator) {
        await Room.findOneAndUpdate(
          { roomName },
          { started: true },
          { useFindAndModify: false }
        );
        io.in(roomName).emit("gameStarting", { msg: "start" });
      } else {
        console.log("NOT CREATOR");
      }
    });

    socket.on("spinWheel", async ({ userId, roomName }) => {
      //check if is user turn
      if (checkIfUserTurn(userId)) {
        if (checkIfRoomExists(roomName)) {
          //return random user on spin
          const room = await Room.findOne({ roomName });
          if (room.started) {
            const filterRoom = room.users.filter(
              (user) => user.toString() !== userId.toString()
            );
            const randomIndex = Math.floor(
              Math.random() * Math.floor(filterRoom.length)
            );
            const user = await User.findById(filterRoom[randomIndex]);
            io.in(roomName).emit("selectedUser", user);
          }
        } else {
          console.log("Room doesnt exist");
        }
      }
    });

    socket.on("onSelect", ({ selection, roomName, userId }) => {
      //broadcast selection to room
      console.log(selection);
      io.in(roomName).emit("onSelect", { selection, userId });
    });

    socket.on("onQuestionSelect", async ({ question, userId, roomName }) => {
      //set current user.turn to false
      await User.findByIdAndUpdate(
        userId,
        { turn: false },
        { useFindAndModify: false }
      );
      const currentRoom = await Room.findOne({ roomName });
      const currentUserIndex = currentRoom.users.findIndex(
        (user) => user.toString() === userId.toString()
      );
      let nextUser = "";
      if (currentUserIndex !== currentRoom.users.length - 1) {
        nextUser = currentRoom.users[currentUserIndex + 1];
      } else {
        nextUser = currentRoom.users[0];
      }
      const nextSelected = await User.findByIdAndUpdate(
        nextUser,
        { turn: true },
        { useFindAndModify: false }
      );
      io.in(roomName).emit("onQuestionSelect", {
        question,
        nextUser: nextSelected.name,
      });
    });

    socket.on("endGame", async ({ userId, roomName }) => {
      const user = await User.findById(userId);
      if (user.creator) {
        //find room where creator = user id
        const room = await Room.findOne({ roomName });
        //for each users in room
        room.users.forEach(async (user) => {
          //delete the user from User Model
          await User.findByIdAndDelete(user);
        });
        //delete message where room id === current room from Message Model
        await Message.deleteMany({ roomId: room._id });
        await Room.deleteOne({ _id: room._id });
        //then delete current room from Room Model
        //delete images in cloudinary
        cloudinary.api.delete_resources_by_tag(roomName);
        io.in(roomName).emit("gameEnded", {
          msg: "Game ended, thanks for playing!",
        });
      } else {
        console.log("Not creator");
      }
    });

    socket.on("sendMessage", async ({ message, userId, roomName, url }) => {
      //broadcast message to room
      const user = await User.findById(userId);

      //add message to database
      const room = await Room.findOne({ roomName });
      const newMessage = new Message({
        content: message,
        sender: userId,
        roomId: room._id,
        url,
      });
      io.in(roomName).emit("sendMessage", {
        sender: user,
        content: message,
        roomId: room._id,
        url,
      });
      await newMessage.save();
    });

    socket.on("leaveRoom", async ({ roomName, userId }) => {
      try {
        //change user if its current user turn
        const user = await User.findById(userId);
        if (user.turn === true) {
          const currentRoom = await Room.findOne({ roomName });
          const currentUserIndex = currentRoom.users.findIndex(
            (user) => user.toString() === userId.toString()
          );
          let nextUser = "";
          if (currentUserIndex !== currentRoom.users.length - 1) {
            nextUser = currentRoom.users[currentUserIndex + 1];
          } else {
            nextUser = currentRoom.users[0];
          }
          const nextSelected = await User.findByIdAndUpdate(
            nextUser,
            { turn: true },
            { useFindAndModify: false }
          );
        }

        //remove user from room
        await Room.findOneAndUpdate({ roomName }, { $pull: { users: userId } });
        await User.findByIdAndDelete(userId);
        io.in(roomName).emit("userLeft", { userId });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(reason);
    });
  });
};

module.exports = createSocketServer;
