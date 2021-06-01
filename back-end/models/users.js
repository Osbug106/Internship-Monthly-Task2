const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const users = new Schema({
    first_name: String,
    last_name: String,
    password: String,
    username: {
        type: String,
        unique: true,
        required: true,
    }, //unique
    email: {
        type: String,
        unique: true,
        required: true,
    }, //u
    email_verification: {
        type: Boolean,
        default: false,
    },
    phone: String,
    website: String,
    address: String,
    api_key: String,
    unique_url: String,
    phone_number_verification: {
        type: Boolean,
        default: false,
    },
    business_info: [{
        businessTimes: {
            monDay: {
                isOpen: Boolean,
                openingTime: Date,
                closingTime: Date,
            },

            tuesDay: {
                isOpen: Boolean,
                openingTime: Date,
                closingTime: Date,
            },
            wednesDay: {
                isOpen: Boolean,
                openingTime: Date,
                closingTime: Date,
            },
            thursDay: {
                isOpen: Boolean,
                openingTime: Date,
                closingTime: Date,
            },
            friDay: {
                isOpen: Boolean,
                openingTime: Date,
                closingTime: Date,
            },
            saturDay: {
                isOpen: Boolean,
                openingTime: Date,
                closingTime: Date,
            },
            sunDay: {
                isOpen: Boolean,
                openingTime: Date,
                closingTime: Date,
            },
        },
        businessName: String,
        // businessCategory:"",
        businessLocation: {
            country: String,
            city: String,
            zip: Number,
            street: String,
            state: String,
        },
        images: {
            profile_pic: {
                100: String,
                250: String,
                400: String,
                550: String,
                700: String,
                original: String,
            },
        },
        createdDate: {
            type: Date,
            default: Date.now(),
        },
    }, ],
}, {
    timestamps: true,
});
module.exports = mongoose.model("users", users);
const Users = mongoose.model("users", users);
module.exports = Users;

module.exports.getUserById = (id, callback) => {
    Users.findById(id, callback);
};
module.exports.getUserByEmail = (email, callback) => {
    const query = {
        email: email,
    };
    Users.findOne(query, callback);
};
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            throw err;
        } else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save(callback);
            });
        }
    });
};
module.exports.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, match) => {
        if (err) {
            throw err;
        }
        callback(err, match);
    });
};