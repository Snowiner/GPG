var express = require("express");
var router = express.Router();
var passport = require("../config/passport");

//home
router.get("/", function(req, res){
  res.render("home/welcome");
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

router.get('/facebook', passport.authenticate('facebook-login'));
router.get('/facebook/callback',passport.authenticate('facebook-login',{
  sucessRedirect: '/users/new',
  failureRedirect:'/login'
}));

module.exports = router;
