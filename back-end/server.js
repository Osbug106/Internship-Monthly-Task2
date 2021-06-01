const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
require("./db").connect();
const app = express();
const routes = require("./routes");
const PORT = process.env.PORT;
const {
    addMessage,
    createChat,
    updateChat
} = require("./controllers/chat");

app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);
app.use(routes);
const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));

////////////////////////////////////////
////////Socket Implementation//////////
//////////////////////////////////////

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

var onlineUsers = [];

const addOnlineUser = (userId, socketId) => {
    var IndexOfOnlineUser = onlineUsers.findIndex((user) => {
        return user.userID === userId;
    });

    if (IndexOfOnlineUser >= 0) {
        //     console.log("User Already Online...");
        onlineUsers[IndexOfOnlineUser].socketID.push(socketId);
    } else {
        // console.log("User Not Online...");
        onlineUsers.push({
            userID: userId,
            socketID: [socketId],
        });
    }
};

const removeOnlineUser = (socketId) => {
    onlineUsers.forEach((user, index) => {
        user.socketID = user.socketID.filter((socket) => socket !== socketId);
        if (!user.socketID.length) {
            onlineUsers.splice(index, 1);
        }
    });
};

const getUser = (userId) => {
    user = onlineUsers.find((onlineUser) => {
        return onlineUser.userID === userId;
    });
    return user;
};

io.on("connection", (socket) => {
    console.log("New connection made.");

    io.emit("welcome", "Hello World");

    setInterval(() => {
        var onlineUserIds = [];
        onlineUsers.forEach((user) => {
            onlineUserIds.push(user.userID);
        });
        // console.log(onlineUserIds);
        socket.emit("getOnlineUsers", onlineUserIds);
    }, 2000);

    socket.on("newUser", (userId) => {
        console.log(userId);
        addOnlineUser(userId, socket.id);
    });

    socket.on("message", async(data) => {
        await addMessage(data);
        var updatedchat = await updateChat(data);
        // console.log(updatedchat);
        var reciever = getUser(data.receiver.id._id);
        if (reciever !== undefined) {
            reciever.socketID.forEach((socketid) => {
                io.to(socketid).emit("message", data);
                io.to(socketid).emit("updatedchat", updatedchat);
            });
        }
        var sender = getUser(data.sender.id._id);
        sender.socketID.forEach((socketid) => {
            io.to(socketid).emit("message", data);
            io.to(socketid).emit("updatedchat", updatedchat);
        });
    });

    socket.on("left", (reason) => {
        removeOnlineUser(socket.id);
    });
});