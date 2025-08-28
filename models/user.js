const mongoose = require("mongoose");
const Schema = {mongoose};
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
    }
});

//we cant defined username and passport because passportlocalmongoose automatically decalred
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);