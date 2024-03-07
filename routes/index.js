var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const localStrategy = require("passport-local");
const passport = require("passport");
const upload = require("./multer");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { error: req.flash("error") });
});

router.get("/login", (req, res) => {
  res.render("login", { error: req.flash("error") });
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  const user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("post");

  console.log(user);
  res.render("profile", { user: user });
});

router.post("/upload", isLoggedIn, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(404).send("No files were uploaded.");
  }

  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  const post = await postModel.create({
    postText: req.body.postText,
    userId: user,
    image: req.file.filename,
  });
  user.post.push(post.id);
  await user.save();
  res.redirect("/profile");
});

router.get("/feed", (req, res) => {
  res.render("feed");
});

router.post("/register", (req, res) => {
  const userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.fullName,
  });

  userModel.register(userdata, req.body.password).then((registereduser) => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
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
