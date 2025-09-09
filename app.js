const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
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
//session middleware
app.use(session(sessionoption));
app.use(flash());
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//locals middleware always write below the passport
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
//User Router
app.use("/",userRouter);
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