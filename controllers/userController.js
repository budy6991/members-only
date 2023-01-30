const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult, check } = require("express-validator");
const flash = require("express-flash-messages");
const bcrypt = require("bcryptjs");
const async = require("async");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

exports.index = (req, res, next) => {
  console.log(req.user);
  res.render("index", { user: req.user });
};

exports.sign_up_get = (req, res, next) => {
  res.render("sign-up-form", {
    title: "Sign Up to the app",
  });
};

exports.sign_up_post = [
  body("first_name", "First name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "User name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password is required").trim().isLength({ min: 5 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
        membership: "user",
      });
      if (!errors.isEmpty()) {
        res.render("sign-up-form", {
          title: "Sign up to the app",
          errors: errors.array(),
        });
      }

      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  },
];

exports.log_in_get = (req, res, next) => {
  console.log(req.user);
  res.render("log-in");
};

exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
});

exports.log_out = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
