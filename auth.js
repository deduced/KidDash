const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "575440888732-lst2joh94qfn4tcv7ae17sbos4cbikk9.apps.googleusercontent.com",
        clientSecret: "GKETWr7tnUWBXIIXwN8dTyDM",
        callbackURL: "http://localhost:9876/auth/google/callback"
      },
      (token, refreshToken, profile, done) => {
        console.log(token);
        return done(null, {
          profile: profile,
          token: token
        });
      }
    )
  );
};
