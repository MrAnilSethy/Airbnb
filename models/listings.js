const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        url:{
            type:String,
            set: (v)=> v==="" ? "https://images.unsplash.com/photo-1718111990329-cfe23a502e06?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
        },
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;