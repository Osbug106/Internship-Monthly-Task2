const express = require("express");
const User = require("../models/users");
const route = express();
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
var randomString = require("random-string");

module.exports.register = (req, res, next) => {
    var x = randomString({
        length: 64,
        numeric: true,
        letters: true,
        special: false,
    });
    const newUser = new User({
        first_name: req.body.fname,
        last_name: req.body.lname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone,
        api_key: x,
        unique_url: req.body.username,
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({
                success: false,
                msg: err,
            });
        } else {
            res.json({
                success: true,
                msg: "User registered.",
            });
        }
    });
};

module.exports.login = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            res.json({
                success: false,
                msg: "User not found.",
            });
        } else {
            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                } else if (isMatch) {
                    const token = jwt.sign({
                            userId: user._id,
                        },
                        SECRET_KEY, {
                            expiresIn: 604800,
                        }
                    );
                    res.json({
                        success: true,
                        msg: "Pawssword matched",
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                        },
                        token: token,
                    });
                } else {
                    res.json({
                        success: false,
                        msg: "Pawssword not matched",
                    });
                }
            });
        }
    });
};

module.exports.getProfile = (req, res) => {
    res.send(req.user);
};

module.exports.getUsers = async(req, res) => {
    const users = await User.find({}).limit(5);
    // console.log(users);
    res.json({
        success: true,
        users,
    });
};

module.exports.getemail = async(req, res) => {
    const emails = await User.find({}, {
        email: 1,
        _id: 0,
    });
    // console.log(emails);
    res.json(emails);
};

module.exports.getusername = async(req, res) => {
    const username = await User.find({}, {
        username: 1,
        _id: 0,
    });
    // console.log(username);
    res.json(username);
};