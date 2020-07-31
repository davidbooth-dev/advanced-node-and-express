const ObjectID = require("mongodb").ObjectID;
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

module.exports = function(app, db) {
  // Setup express-session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    db.collection("users").findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });
  
  passport.use(
    new Strategy(
      {
        usernameField: "username",
        passwordField: "password"
      },
      (username, password, done) => {
        db.collection("users").findOne({ username: username }, function(
          err,
          user
        ) {
          console.log("User " + username + " attempted to log in.");
          if (err) {
            console.log(err);
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
          }
          return done(null, user);
        });
      }
    )
  );
};
