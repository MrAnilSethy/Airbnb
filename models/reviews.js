const mongoose = require("mongoose");
// const { type } = require("../schema");
// const { required } = require("joi");
const {Schema} = mongoose;
const reviewSchema = new Schema({
    rating:{
        type:Number,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    date:{
        type:Date,

    }
});
module.exports = mongoose.model("Review",reviewSchema);