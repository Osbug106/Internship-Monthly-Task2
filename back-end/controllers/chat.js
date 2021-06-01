const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const Chat = require("../models/chat");
const Messages = require("../models/messages");

module.exports.getChats = async(req, res) => {
    var token = req.headers.authorization;
    var userId;

    jwt.verify(token, SECRET_KEY, (err, data) => {
        if (err) {
            console.log("Token Error: ", err);
            return res.sendStatus(403);
        } else {
            userId = data.userId;
        }
    });

    const chats = await Chat.find({
            $or: [{
                "sender.id": userId,
            }, {
                "receiver.id": userId,
            }, ],
        }, {
            _id: 1,
            message: 1,
            channelId: 1,
            sender: 1,
            receiver: 1,
            chatSubject: 1,
            unreadMessageCount: 1,
            attachments: 1,
            createdDate: 1,
            updatedAt: 1,
        })
        .populate([{
            path: "sender.id",
            select: "username",
        }, {
            path: "receiver.id",
            select: "username",
        }, ])
        .sort({
            updatedAt: "descending",
        });
    res.json(chats);
};

module.exports.getMessages = async(req, res) => {
    var channelId = req.params.id;

    const messages = await Messages.find({
            chatId: channelId,
        }, {
            _id: 1,
            message: 1,
            chatId: 1,
            sender: 1,
            receiver: 1,
            createdAt: 1,
            updatedAt: 1,
        })
        .populate([{
            path: "sender.id",
            select: "username",
        }, {
            path: "receiver.id",
            select: "username",
        }, ])
        .sort({
            updatedAt: "ascending",
        });
    res.json(messages);
};

module.exports.createChat = async(req, res) => {
    const newChat = new Chat({
        message: req.body.message,
        channelId: req.body.channelID,
        sender: req.body.senderID,
        receiver: req.body.receiverID,
        chatSubject: req.body.chatSubject,
        postId: req.body.postID,
        productId: req.body.productID,
        chatType: req.body.chatType,
        unreadMessageCount: [...req.body.unreadMessageCount],
        attachments: [...req.body.attachments],
    });

    newChat.save((err, user) => {
        if (err) {
            res.json({
                success: false,
                msg: err,
            });
        } else {
            res.json({
                success: true,
                msg: "Chat added.",
            });
        }
    });
};

module.exports.addMessage = (data) => {
    console.log("In add Message...");
    const newMessage = new Messages({
        message: {
            type: data.message.type,
            body: {
                text: data.message.body.text,
                files: [...data.message.body.files],
            },
        },
        chatId: data.chatId,
        sender: {
            id: {
                _id: data.sender.id._id,
            },
        },
        receiver: {
            id: {
                _id: data.receiver.id._id,
            },
        },
    });

    newMessage.save((err, user) => {
        if (err) {
            return {
                success: false,
                msg: err,
            };
        } else {
            return {
                success: true,
                msg: "Message added.",
            };
        }
    });
};

module.exports.updateChat = async(data) => {
    // console.log(data);
    const chat = await Chat.updateOne({
        channelId: data.chatId,
    }, {
        $set: {
            message: data.message,
        },
    });
    const updatedChat = await Chat.find({
        channelId: data.chatId,
    }).populate([{
        path: "sender.id",
        select: "username",
    }, {
        path: "receiver.id",
        select: "username",
    }, ]);
    // res.json(updatedChat);
    return updatedChat;
};