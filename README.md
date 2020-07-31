# Introduction to Advanced Node and Express Challenges

A Node, Express App using pug as the view engine.

## Issues
  1. Getting Passport middleware to work
  
 ```
   app.route("/login").post((req, res, next) => {
    passport.authenticate("local", {
      failureRedirect: "/error",
      successRedirect: "/profile"
    })(req, res, next);
  });
```
  You need to pass req, res, next to the middleware function
