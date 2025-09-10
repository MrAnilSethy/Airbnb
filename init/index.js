const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
main().then(()=>{
    console.log("Db connecetd");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
async function DbInit(){
    await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=> ({...obj,owner:"68b09e7ad91bfe29a50957f4"}))
    await Listing.insertMany(initData.data);
    console.log("Data initilized");
}
DbInit();