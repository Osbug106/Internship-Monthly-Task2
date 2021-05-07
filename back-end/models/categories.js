const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;
const category = new Schema(
    {
        name: String,
        slug: String,
        breadcrumb: String,
        link: String,
        parent: {
            type: ObjectId,
            ref: "category"
        },

        description: String,
        metaTitle: String,
        productCount: Number,
        L1: String,
        L2: String,
        L3: String,
        L4: String,
        metaDescription: String,
    }, { timestamps: true })
module.exports = mongoose.model('categories', category);