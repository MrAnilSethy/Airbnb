const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listings.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const reviewSchema = require("../reviewSchema.js");
const listingSchema = require("../schema.js");
const {validateReview, isLoggedIn, isReviewAuthor} =  require("../middleware.js");


//review Post
router.post("/",validateReview,
    isLoggedIn,
    wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    console.log(req.body)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // for everyincoming review author are added!
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));
//review Delete
router.delete("/:reviewId",
    isLoggedIn,isReviewAuthor,
    wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
}));

module.exports = router;