const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let messageSchema = new Schema({
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
    sender: {
        // api_key: String,
        // username: String,
        // profile_pic: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    },
    receiver: {
        // api_key: String,
        // username: String,
        // profile_pic: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    },
    viewed: {
        type: Boolean,
        default: false,
    },
    deletedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        deleted_at: {
            type: Date,
            default: Date.now,
        },
    }, ],
    chatId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
let Messages = mongoose.model("Message", messageSchema);
module.exports = Messages;