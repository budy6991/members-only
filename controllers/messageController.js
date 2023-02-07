const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.create_message_get = (req, res, next) => {
  console.log(`User is ${req.user}`);
  res.render("message-form");
};

exports.create_message_post = [
  body("message_title").trim().isLength({ min: 1 }).escape(),
  body("message_content").isLength({ min: 20 }).escape(),
  (req, res, next) => {
    console.log("USERRRR ISSS" + req.user);
  },
];
