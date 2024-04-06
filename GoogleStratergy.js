const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {Google} = require('./config');
passport.use(new GoogleStrategy({
    clientID: Google.ClientId,
    clientSecret: Google.ClientSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));