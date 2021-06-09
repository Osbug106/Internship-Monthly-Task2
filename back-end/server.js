const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
require("./db").connect();
const app = express();
const routes = require("./routes");
const PORT = process.env.PORT;
const path = require("path");
const fs = require("fs");
const {
    checkChat,
    addMessage,
    createChat,
    updateChat,
    resetUnreadCount,
    incUnreadCount,
    addGroupMessage,
    createGroupChat,
    clearChat,
    markUnread,
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

    // update online users every 2 seconds
    setInterval(() => {
        var onlineUserIds = [];
        onlineUsers.forEach((user) => {
            onlineUserIds.push(user.userID);
        });
        socket.emit("getOnlineUsers", onlineUserIds);
    }, 2000);

    socket.on("newUser", (userId) => {
        console.log(userId);
        addOnlineUser(userId, socket.id);
    });

    socket.on("message", async(data) => {
        var reciever = getUser(data.receiver.id._id);

        await addMessage(data);
        incUnreadCount(data.chatId, data.receiver.id._id);

        var updatedchat = await updateChat(data);

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

    socket.on("resetUnreadCount", async(data) => {
        resetUnreadCount(data.chatId, data.userId);
    });

    socket.on("newChatMessage", async(data) => {
        var reciever = getUser(data.receiver.id._id);

        var chat = await checkChat({
            senderId: data.sender.id._id,
            reveiverId: data.receiver.id._id,
        });

        if (chat.length) {
            data.chatId = chat[0].channelId;
            await addMessage(data);
            incUnreadCount(data.chatId, data.receiver.id._id);

            var updatedchat = await updateChat(data);

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
        } else {
            var newChat = await createChat(data);
            data.chatId = newChat.channelId;

            await addMessage(data);
            var updatedchat = await updateChat(data);

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
        }
    });

    socket.on("groupMessage", async(data) => {
        var reciever;

        await addGroupMessage(data);

        data.participants.forEach((member) => {
            if (member.userId != data.sender.id._id) {
                incUnreadCount(data.chatId, member.userId);
            }
        });

        var updatedchat = await updateChat(data);

        data.participants.forEach((member) => {
            reciever = getUser(member.userId);

            if (reciever !== undefined) {
                reciever.socketID.forEach((socketid) => {
                    io.to(socketid).emit("message", data);
                    io.to(socketid).emit("updatedchat", updatedchat);
                });
            }
        });
    });

    socket.on("newGroup", async(data) => {
        var reciever;
        var newChat = [];
        await addGroupMessage(data);

        data.participants.forEach((member) => {
            if (member.userId != data.sender.id._id) {
                incUnreadCount(data.chatId, member.userId);
            }
        });

        newChat.push(await createGroupChat(data));
        data.chatId = newChat.channelId;

        data.participants.forEach((member) => {
            reciever = getUser(member._id);
            if (reciever !== undefined) {
                reciever.socketID.forEach((socketid) => {
                    io.to(socketid).emit("message", data);
                    io.to(socketid).emit("updatedchat", newChat);
                });
            }
        });

        var sender = getUser(data.sender.id._id);
        sender.socketID.forEach((socketid) => {
            io.to(socketid).emit("message", data);
            io.to(socketid).emit("updatedchat", newChat);
        });
    });

    socket.on("clearChat", (data) => {
        clearChat(data);
        var sender = getUser(data.userId);
        sender.socketID.forEach((socketid) => {
            io.to(socketid).emit("chatCleared", true);
        });
    });

    socket.on("markUnread", (data) => {
        markUnread(data);
    });

    socket.on("markRead", (data) => {
        resetUnreadCount(data.chatId, data.userId);
    });

    socket.on("left", (reason) => {
        removeOnlineUser(socket.id);
    });
});