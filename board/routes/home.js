var express = require("express");
var router = express.Router();
var passport = require("../config/passport");

//home
router.get("/", isLoggedIn, function(req, res){
  res.render("home/welcome", { user : req.user });
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

router.get("/facebook", passport.authenticate("facebook-login", { scope: ['public_profile','email'] }));
router.get("/facebook/callback",passport.authenticate("facebook-login",{
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

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
