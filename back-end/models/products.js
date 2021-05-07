const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;
const product = new Schema(
    {

        title:String,
        sku:String,
        slug:String,
        merchant_id:{type:ObjectId,ref:"users"},
        productState:String,
        price:Number,
        msrp:Number,
        totalCost:Number,
        description:String,
        published_date:Date,
        product_images:[{}],
        type:String,
        isTrashed:Boolean,
        isFeature:Boolean,
        category:{type:ObjectId,ref:"categories"},
        isBanner : Boolean,
        newArrival:Boolean,
    }, { timestamps: true })
module.exports = mongoose.model('products', product);