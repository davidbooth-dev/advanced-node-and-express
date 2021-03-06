const passport = require("passport");
const bcrypt = require("bcrypt");

module.exports = function(app, db) {
  
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }

  app.route("/").get((req, res) => {
    res.render(process.cwd() + "/views/pug/index", {
      title: "Home Page",
      showLogin: true,
      showRegistration: true
    });
  });

  app.route("/profile").get(ensureAuthenticated, (req, res, next) => {
    res.render(process.cwd() + "/views/pug/profile", {
      title: "Profile",
      username: req.user.username
    });
  });

  app.route("/login").post((req, res, next) => {
    passport.authenticate("local", {
      failureRedirect: "/error",
      successRedirect: "/profile"
    })(req, res, next);
  });

  app.route("/error").get((req, res) => {
    if (req.user === undefined) {
      res.render(process.cwd() + "/views/pug/index", {
        title: "Home Page",
        user: "User Not Found",
        showLogin: true,
        showRegistration: true
      });
    }
  });

  app.route("/logout").get((req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.route("/register").post(
    (req, res, next) => {
      db.collection("users").findOne({ username: req.body.username }, function(
        err,
        user
      ) {
        if (err) {
          next(err);
        } else if (user) {
          res.redirect("/");
        } else {
          var hash = bcrypt.hashSync(req.body.password, 12);
          db.collection("users").insertOne(
            {
              username: req.body.username,
              password: hash
            },
            (err, doc) => {
              if (err) {
                res.redirect("/");
              } else {
                next(null, user);
              }
            }
          );
        }
      });
    },
    passport.authenticate("local", {
      failureRedirect: "/",
      successRedirect: "/profile"
    })
  );

  app.use((req, res, next) => {
    res
      .status(404)
      .type("text")
      .send("Not Found");
  });
};
