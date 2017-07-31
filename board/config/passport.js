var passport = require("passport");
var mongoose = require("mongoose");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require("../models/User");
var fUser = require("../models/facebook");


//serialize & deserialize User
passport.serializeUser(function(user, done){
  done(null, user.id);
}); //passport.serializeUser는 login시에 DB에서 발견한 user를 어떻게 session에 저장할지를 정하는 부분. 효율을 위해 user의 id만 session에 저장.
passport.deserializeUser(function(id, done){
  User.findOne({_id:id}, function(err, user){
    done(err, user);
  });
}); //passport.deserializeUser는 request시에 session에서 어떻게 user object를 만들지를 정하는 부분. 매번 request마다 user 정보를 db에서 새로 읽어오는데, user가 변경되면 바로 변경된 정보가 반영되는 장점이 있다.

//local Strategy
passport.use("local-login",
new LocalStrategy({
  usernameField : "username",
  passwordField : "password",
  passReqToCallback : true
},
function(req, username, password, done){
  User.findOne({username:username})
  .select({password:1})
  .exec(function(err, user) {
    if (err) return done(err);

    if(user && user.authenticate(password)){
      return done(null, user);
    } else {
      req.flash("username", username);
      req.flash("errors", {login:"Incorrect username or password"});
      return done(null, false);
    }
  });
}
)
);

passport.use('facebook-login', new FacebookStrategy({
  clientID : '260682471086328',
  clientSecret : 'eca9128dc07f445a279d072eb78b7128',
  callbackURL : 'http://localhost:3000/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  process.nextTick(function() {
    User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
      if (err) return done(err);
      console.log(fUser);
      if (!fUser) {
        console.log("yes");
        return done(null, user);
      } else {
        console.log("no");
        var newUser = new fUser();
        console.log(profile.id);

        newUser.facebook.id = profile.id;
        newUser.facebook.token = token;
        newUser.facebook.name = profile.name;
        newUser.facebook.email = profile.email[0].value;

        newUser.save(function(err) {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  });
}));



module.exports = passport;
