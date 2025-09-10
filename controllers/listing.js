const Listing = require("../models/listings");
module.exports.index= async (req,res)=>{
    let allListing = await Listing.find({});
     res.render("./listings/index.ejs",{allListing})
}