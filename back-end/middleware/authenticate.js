const jwt = require("jsonwebtoken");
const User = require("../models/users");
const tokenSecret = process.env.SECRET_KEY;

module.exports.authenticate = (req, res, next) => {
    let jwt_payload;
    if (req.headers.authorization) {
        jwt_payload = jwt.verify(
            req.headers.authorization.split(" ")[1],
            tokenSecret
        );
    } else if (req.query.token) {
        jwt_payload = jwt.verify(req.query.token, tokenSecret);
    } else {
        res.sendStatus(401);
        return;
    }
    User.findOne({
            username: jwt_payload.username,
        },
        function(err, user) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            if (user) {
                req.user = user;
                next();
            } else {
                res.sendStatus(403);
            }
        }
    );
};

module.exports.authorized = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader;

        jwt.verify(token, SECRET_KEY, async(err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            const authUser = await User.findOne({
                username: user.username,
            }, {
                _id: 1,
                username: 1,
                email: 1,
            });
            req.user = authUser;
            // res.send(authUser);
            next();
        });
    } else {
        res.sendStatus(401);
    }
};