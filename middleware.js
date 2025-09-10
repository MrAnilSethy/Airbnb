const Listing = require("./models/listings");
const Review = require("./models/reviews.js");
const reviewSchema = require("./reviewSchema.js");
const listingSchema = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in!");
        return res.redirect("/login");
    }
    next();
    3
}
//for right path for click then direct redirect!
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
//for admin or owner
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You have not permission!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//for listing validation
module.exports.validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//for review validation
module.exports.validateReview = (req,res,next)=>{
    let {error} = req.body;
    if(error){
        throw new ExpressError(400,"write valid review");
    }else{
        next();
    }
}
//for review authorization
module.exports.isReviewAuthor = async(req,res,next)=>{
    let{id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You Cant delete other Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}