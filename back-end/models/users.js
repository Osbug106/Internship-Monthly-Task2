const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema(
    {
        first_name: String,
        last_name: String,
        password: String,
        username: {
            type: String,
            unique: true,
            required: true
        }, //unique
        email: {
            type: String,
            unique: true,
            required: true
        }, //u
        email_verification: { type: Boolean, default: false },
        phone: String,
        website: String,
        address: String,
        phone_number_verification: { type: Boolean, default: false },
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
                }
            },
            createdDate: { type: Date, default: Date.now() },
        }]
    }, { timestamps: true })
module.exports = mongoose.model('users', user);