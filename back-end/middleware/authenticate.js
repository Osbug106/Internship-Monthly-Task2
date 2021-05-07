// const JwtStrategy = require('passport-jwt').Strategy,
//     ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const tokenSecret = process.env.ACCESS_TOKEN_SEC
// // const passport = require('passport')
// var opts = {}
// opts.jwtFromRequest = (req)=>{
//         return jwt.verify(req.headers.authorization.split(" ")[1], tokenSecret)
//     }
// //ExtractJwt.fromAuthHeaderAsBearerToken()

// opts.secretOrKey = tokenSecret

// strategy = new JwtStrategy(opts, function(jwt_payload, done) {
//     console.log(jwt_payload)
//     User.findOne({username: jwt_payload.username}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     });
// });

// passport.serializeUser(function(user, done) {
//     done(null, user);
//   });

//   passport.deserializeUser(function(user, done) {
//     done(null, user);
//   });


function authenticate(req,res,next){
    let jwt_payload;
    if(req.headers.authorization){
        jwt_payload = jwt.verify(req.headers.authorization.split(" ")[1], tokenSecret)
    }
    else if (req.query.token){
        jwt_payload = jwt.verify(req.query.token, tokenSecret)
    }else{
        res.sendStatus(401)
        return;
    }
    User.findOne({username: jwt_payload.username}, function(err, user) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (user) {
            req.user = user;
            next();
        } else {
            res.sendStatus(403)
        }
    });
}
module.exports = authenticate