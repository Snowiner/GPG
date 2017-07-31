var express = require("express");
var router = express.Router();
var passport = require("../config/passport");
var User = require("../models/User");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//home
router.get("/", function(req, res){
  res.render("home/welcome");
});

//addFriend
router.post("/addFriend",function(req,res){
  User.update(
    { _id: req.user._id },
    { $push: { 
      friends: 
      req.body.targetName
      
    } },
    function(err,post)
    {
      if(err) return res.json(err);

      console.log(req.user._id);
      console.log(req.user.friends);
      res.redirect("/users/"+req.user.username);
    }
    );
});

//login
router.get("/login", function(req,res){
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("home/login", {
    username:username,
    errors:errors
  });
});

//Post login
router.post("/login",
function(req,res,next){
  var errors = {};
  var isValid = true;
  if(!req.body.username){
    isValid = false;
    errors.username = "Username is required!";
  }
  if(!req.body.password){
    isValid = false;
    errors.password = "Password is requierd!";
  }

  if(isValid){
    next();
  } else {
    req.flash("errors", errors);
    res.redirect("/login");
  }
},
passport.authenticate("local-login", {
  successRedirect : "/",
  failureRedirect : "/login"
}
));

//logout
router.get("/logout", function(req, res) {
 req.logout();
 res.redirect("/");
});

module.exports = router;
