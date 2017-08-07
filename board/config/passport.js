var passport = require("passport");
var mongoose = require("mongoose");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require("../models/User");


//serialize & deserialize User
passport.serializeUser(function(user, done){
  done(null, user);
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

passport.use('facebook-login',
new FacebookStrategy({
  clientID : '260682471086328',
  clientSecret : 'eca9128dc07f445a279d072eb78b7128',
  callbackURL : 'http://kimanna17.tk/facebook/callback'
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    User.findOne({username:profile.id})
    .exec(function(err, user) {
      if (err) return done(err);

      if(user){
        return done(null, user);
      } else {
        var newUser = new User();
        newUser.username = profile.id;
        newUser.name = profile.displayName;
        newUser.token = accessToken;
        newUser.email = profile.email;
        newUser.from = 'facebook';
        newUser.password = '123caute$%^';

        newUser.save(function(err) {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  });
}));

passport.use('google-login',
new GoogleStrategy({
  clientID : '735938911453-c19fhctjdfjivld16tvvnrll4mh15ne8.apps.googleusercontent.com',
  clientSecret : 'ME6nAecXeQUHHdYUaD4WbAAL',
  callbackURL : 'http://localhost:80/google/callback'
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    User.findOne({username:profile.id})
    .exec(function(err, user) {
      if (err) return done(err);

      if(user){
        return done(null, user);
      } else {
        var newUser = new User();
        newUser.username = profile.id;
        newUser.name = profile.displayName;
        newUser.token = accessToken;
        newUser.email = profile.email;
        newUser.from = 'google';
        //newUser.password = '123caute$%^';

        newUser.save(function(err) {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  });
}));


module.exports = passport;
