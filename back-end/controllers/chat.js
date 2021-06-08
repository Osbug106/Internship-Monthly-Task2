const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const Chat = require("../models/chat");
const Connects = require("../models/connects");
const Messages = require("../models/messages");
const mongoose = require("mongoose");
var randomString = require("random-string");

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
                $and: [{
                    "sender.id": userId,
                }, {
                    chatType: {
                        $ne: "group",
                    },
                }, ],
            }, {
                $and: [{
                    "receiver.id": userId,
                }, {
                    chatType: {
                        $ne: "group",
                    },
                }, ],
            }, ],
        }, {
            _id: 1,
            message: 1,
            channelId: 1,
            sender: 1,
            receiver: 1,
            chatSubject: 1,
            chatType: 1,
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

module.exports.getGroupChats = async(req, res) => {
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
            $and: [{
                chatType: {
                    $eq: "group",
                },
            }, {
                "sender.id": userId,
            }, ],
        }, {
            $and: [{
                chatType: {
                    $eq: "group",
                },
            }, {
                participants: {
                    $elemMatch: {
                        userId: userId,
                    },
                },
            }, ],
        }, ],
    }, {
        _id: 1,
        message: 1,
        channelId: 1,
        sender: 1,
        receiver: 1,
        participants: 1,
        chatSubject: 1,
        chatType: 1,
        unreadMessageCount: 1,
        attachments: 1,
        createdDate: 1,
        updatedAt: 1,
    }).sort({
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
            participants: 1,
            createdAt: 1,
            updatedAt: 1,
            deletedBy: 1,
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

module.exports.createChat = (data) => {
    var temp = [{
        userId: data.sender.id._id,
        totalUnread: 0,
    }, {
        userId: data.receiver.id._id,
        totalUnread: 1,
    }, ];

    const newChat = new Chat({
        message: data.message,
        channelId: randomString({
            length: 64,
            numeric: true,
            letters: true,
            special: false,
        }),
        "sender.id": data.sender.id._id,
        "receiver.id": data.receiver.id._id,
        chatSubject: " ",
        postId: " ",
        productId: " ",
        chatType: data.chatType,
        unreadMessageCount: temp,
        attachments: [],
    });

    return new Promise((res, rej) => {
        newChat.save((err, chat) => {
            if (err) {
                console.log({
                    success: false,
                    msg: err,
                });
                rej(err);
            } else {
                console.log("Adding: ", chat);
                res(chat);
            }
        });
    });
};

module.exports.addMessage = (data) => {
    const newMessage = new Messages({
        message: {
            type: data.message.type,
            body: {
                text: data.message.body.text,
                files: [],
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

module.exports.addGroupMessage = (data) => {
    const newMessage = new Messages({
        message: {
            type: data.message.type,
            body: {
                text: data.message.body.text,
                files: [],
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
                _id: data.participants[0]._id,
            },
        },
        participants: data.participants,
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

module.exports.resetUnreadCount = async(chatId, userId) => {
    await Chat.updateOne({
        channelId: chatId,
        "unreadMessageCount.userId": userId,
    }, {
        $set: {
            "unreadMessageCount.$.totalUnread": 0,
        },
    });
};

module.exports.incUnreadCount = async(chatId, userId) => {
    await Chat.updateOne({
        channelId: chatId,
        "unreadMessageCount.userId": userId,
    }, {
        $inc: {
            "unreadMessageCount.$.totalUnread": 1,
        },
    });
};

module.exports.getAllConnections = async(req, res) => {
    var connects = await Connects.find({
        $or: [{
            connector: req.params.id,
        }, {
            connectWith: req.params.id,
        }, ],
    }, {
        _id: 0,
        connector: 1,
        connectWith: 1,
    }).populate([{
        path: "connector",
        select: "_id, username",
    }, {
        path: "connectWith",
        select: "_id, username",
    }, ]);

    res.json(connects);
};

module.exports.checkChat = async(data) => {
    const chat = await Chat.find({
        $or: [{
            $and: [{
                "sender.id": data.senderId,
            }, {
                "receiver.id": data.reveiverId,
            }, ],
        }, {
            $and: [{
                "sender.id": data.reveiverId,
            }, {
                "receiver.id": data.senderId,
            }, ],
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
    });

    return chat;
};

module.exports.createGroupChat = (data) => {
    var tempParticipants = [];
    tempParticipants.push({
        userId: data.sender.id,
    });
    data.participants.forEach((participant) => {
        tempParticipants.push({
            userId: participant._id,
        });
    });

    var tempUnreadCount = [];
    tempUnreadCount.push({
        userId: data.sender.id,
        totalUnread: 1,
    });
    data.participants.forEach((participant) => {
        tempUnreadCount.push({
            userId: participant._id,
            totalUnread: 1,
        });
    });

    const newChat = new Chat({
        message: data.message,
        channelId: randomString({
            length: 64,
            numeric: true,
            letters: true,
            special: false,
        }),
        "sender.id": data.sender.id,
        "receiver.id": data.participants[0],
        participants: tempParticipants,
        chatSubject: data.chatSubject,
        postId: " ",
        productId: " ",
        chatType: data.chatType,
        unreadMessageCount: tempUnreadCount,
        attachments: [],
    });

    return new Promise((res, rej) => {
        newChat.save((err, chat) => {
            if (err) {
                console.log({
                    success: false,
                    msg: err,
                });
                rej(err);
            } else {
                res(chat);
            }
        });
    });
};

module.exports.clearChat = async(data) => {
    await Messages.updateMany({
        chatId: data.chatId,
    }, {
        $push: {
            deletedBy: {
                userId: data.userId,
            },
        },
    });
};

module.exports.markUnread = async(data) => {
    await Chat.updateOne({
        channelId: data.chatId,
        "unreadMessageCount.userId": data.userId,
    }, {
        $set: {
            "unreadMessageCount.$.totalUnread": -1,
        },
    });
};