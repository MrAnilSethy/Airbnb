const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
   res.render("users/signup.ejs");
});
router.post("/signup",async(req,res,next)=>{
    try{
  let {username,email,password} = req.body;
    let newUser = new User({username,email});
     let registredUser = await User.register(newUser,password);
     req.login(registredUser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Welcome to wanderLust");
      res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error","username already exit");
        console.log(e.message)
        res.redirect("/signup");
    } 
});
 
//login
router.get("/login",(req,res)=>{
  res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,
  passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), //passport middleware
  (req,res)=>{
    req.flash("success","Welcome to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
});


router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      next(err); 
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  });
 

})
module.exports = router;