const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
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
const sessionoption = {
    secret:"mysecretsupercode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7,
        httpOnly:true,
    }
}
//Home Route
app.get("/",(req,res)=>{
    res.send("hi i am root");
});
app.use(session(sessionoption));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    next();
})
//Listings Router
app.use("/listings",listingRouter);
//review Router
app.use("/listings/:id/reviews",reviewRouter);
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