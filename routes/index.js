var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const localStrategy = require("passport-local");
const passport = require("passport");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", isLoggedIn, (req, res,next) => {
  res.render("profile");
});

router.get("/feed", (req, res) => {
  res.render("feed");
});

router.post("/register", (req, res) => {
  const userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.email,
  });

  userModel.register(userdata, req.body.password).then((registereduser) => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
