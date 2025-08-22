const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingSchema = require("../schema.js");
//for listingSchema validation
const validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    let allListing = await Listing.find({});
     res.render("./listings/index.ejs",{allListing})
}));
//New Route
router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
});
//Show route
router.get("/:id",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    let showListing = await Listing.findById(id).populate("reviews");
    if(!showListing){
        throw new ExpressError(404,"page not found");
    }
    res.render("./listings/show.ejs",{showListing});
}));
//Create  Route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data from listing");
    }
 let newListing = new Listing (req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
   
}));
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let updateListing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{updateListing})
}));

//Edit Route
router.put("/:id/edit",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"write valid data for listing");
    }
  await Listing.findByIdAndUpdate(id,req.body.listing);
    req.flash("success","Listing Updated");
    res.redirect("/listings");
}));

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    if(!deleteListing){
        throw ExpressError(400,"Listing not found");
    }
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));
module.exports = router;