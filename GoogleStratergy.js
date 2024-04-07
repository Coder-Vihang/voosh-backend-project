const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {Google} = require('./config');
passport.use(new GoogleStrategy({
    clientID: Google.ClientId,
    clientSecret: Google.ClientSecret,
    callbackURL: "https://voosh-backend-project.onrender.com/auth/google/callback"
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });