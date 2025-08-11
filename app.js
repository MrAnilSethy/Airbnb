const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Review = require("./models/reviews.js");
const listingSchema = require("./schema.js");
const reviewSchema = require("./reviewSchema.js");
app.engine("ejs",ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
main().then(()=>{
    console.log("Db connecetd");
}).catch((err)=>{ 
    console.log(err);
})
async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
//for listingSchema validation
const validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
//for reviewSchema validation
const validateReview = (req,res,next)=>{
    let {error} = req.body;
    if(error){
        throw new ExpressError(400,"write valid review");
    }else{
        next();
    }
}
//Home Route
app.get("/",(req,res)=>{
    res.send("hi i am root");
});
//Show Route
app.get("/listings",wrapAsync(async (req,res)=>{
    let allListing = await Listing.find({});
     res.render("./listings/index.ejs",{allListing})
}));
//New Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});
app.get("/listings/:id",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    let showListing = await Listing.findById(id).populate("reviews");
    if(!showListing){
        throw new ExpressError(404,"page not found");
    }
    res.render("./listings/show.ejs",{showListing});
}));
//Create  Route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data from listing");
    }
 let newListing = new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings");
   
}));
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let updateListing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{updateListing})
}));

//Edit Route
app.put("/listings/:id/edit",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"write valid data for listing");
    }
  await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect("/listings");
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    if(!deleteListing){
        throw ExpressError(400,"Listing not found");
    }
    res.redirect("/listings");
}));
//review Post
app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));
//review Delete
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
  

}));
app.use((req,res)=>{
     throw new ExpressError(404,"Page not found");
});
app.use((err,req,res,next)=>{
    let {status=500,message="some error occured"} = err;
    res.status(status).render("./error.ejs",{err});
});
app.listen(8080,()=>{
    console.log("server listing port at 8080");
});