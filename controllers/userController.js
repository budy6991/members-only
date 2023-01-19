const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.sign_up_get = (req, res, next) => {
  res.render("sign-up-form", {
    title: "Sign Up to the app",
  });
};
