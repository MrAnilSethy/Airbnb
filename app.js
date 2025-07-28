const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
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
//Home Route
app.get("/",(req,res)=>{
    res.send("hi i am root");
});
//Show Route
app.get("/listings",async (req,res)=>{
    let allListing = await Listing.find({});
     res.render("./listings/index.ejs",{allListing})
});
//New Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});
app.get("/listings/:id",async(req,res,next)=>{
    let {id} = req.params;
    let showListing = await Listing.findById(id);
    res.render("./listings/show.ejs",{showListing});
});
//Create  Route
app.post("/listings",async(req,res,next)=>{
    try{
 let newListing = new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    }catch(err){
        next(err);
    }
   
});
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let updateListing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{updateListing})
});

//Edit Route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect("/listings");
});

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
   
});
app.use((err,req,res,next)=>{
    res.send("Something went wrong");
})
app.listen(8080,()=>{
    console.log("server listing port at 8080");
})