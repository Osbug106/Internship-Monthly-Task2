var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ChatSchema = new Schema({
    channelId: {
        type: String,
        // index: true,
        // unique: true
    },
    sender: {
        // sender who create or initiate channel
        senderId: String, // Receiver/Shortlisted product API key
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    },
    receiver: {
        receiverId: String, // Receiver/Shortlisted product API key
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    }, ],
    productId: {
        type: String,
        ref: "Product",
    }, // Id of the product from where the message is created
    postId: {
        type: String,
        ref: "Post",
    }, // Shortlisted product Id
    chatSubject: {
        type: String,
        required: true, //added
    },
    chatType: {
        type: String,
    },
    message: {
        type: {
            type: String,
        },
        body: {
            text: String,
            files: [{
                source: String,
                fileType: String,
            }, ],
        },
    },
    readby: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        read_at: {
            type: Date,
            default: Date.now,
        },
    }, ], // save ID of the shortlisted peoples
    unreadMessageCount: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        totalUnread: {
            type: Number,
            default: 0,
        },
    }, ],
    viewedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        viewed_at: {
            type: Date,
            default: Date.now,
        },
    }, // list of user who viewed the notification
    staredBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        stared_at: {
            type: Date,
            default: Date.now,
        },
    }, ],
    deletedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        deleted_at: {
            type: Date,
            default: Date.now,
        },
    }, ],
    mutedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    }, ],
    senderReportTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    receiverReportTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    senderReason: {
        type: String,
        default: "",
    }, // sender who create or initiate channel
    receiverReason: {
        type: String,
        default: "",
    },
    senderUnreadMessage: {
        type: Number,
        default: 0,
    }, // sender who create or initiate channel
    receiverUnreadMessage: {
        type: Number,
        default: 0,
    },
    senderComment: {
        type: String,
        default: "",
    }, // sender who create or initiate channel
    receiverComment: {
        type: String,
        default: "",
    },
    archivedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        archive_at: {
            type: Date,
            default: Date.now,
        },
    }, ],
    attachments: [{
        fileType: {
            type: String,
        },
        fileName: {
            type: String,
        },
        url: {
            type: String,
        },
        uploaderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        uploadTimetoken: {
            type: Date,
            default: Date.now,
        },
    }, ],
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
}, {
    usePushEach: true,
    timestamps: true,
    versionKey: false,
});
var Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;