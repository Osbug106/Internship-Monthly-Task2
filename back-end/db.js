module.exports.connect = function() {
    var mongoose = require("mongoose");
    const CONN_STR = process.env.DB_CONN_STR;
    var mongoDB = CONN_STR;
    mongoose.connect(mongoDB, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    var db = mongoose.connection;
    db.on("connected", () => {
        console.log("Database connection successful.");
    });
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
};