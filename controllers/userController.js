const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");

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
  body("password", "Password is required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      membership: "user",
    });
    console.log(req);
    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        title: "Sign up to the app",
        errors: errors.array(),
      });
    }
    console.log(req.user);
    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];
