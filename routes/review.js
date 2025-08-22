const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listings.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const reviewSchema = require("../reviewSchema.js");
const listingSchema = require("../schema.js");
//for reviewSchema validation
const validateReview = (req,res,next)=>{
    let {error} = req.body;
    if(error){
        throw new ExpressError(400,"write valid review");
    }else{
        next();
    }
}
//review Post
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));
//review Delete
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
}));

module.exports = router;