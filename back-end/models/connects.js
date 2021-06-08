var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ConnectsSchema = new Schema({
    status: {
        type: Boolean,
    },
    wasInvited: {
        type: Boolean,
    },
    connector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    connectWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, {
    usePushEach: true,
    timestamps: true,
    versionKey: false,
});
var Connects = mongoose.model("connects", ConnectsSchema);
module.exports = Connects;