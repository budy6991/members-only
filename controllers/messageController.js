const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.create_message_get = (req, res, next) => {
  console.log(`User is ${req.user}`);
  res.render("message-form");
};

exports.create_message_post = [
  body("message_title", "Please write a title")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("message_content", "Please write the message content")
    .isLength({ min: 20 })
    .escape(),
  (req, res, next) => {
    console.log("User is" + req.user);
    const errors = validationResult(req);
    const message = new Message({
      author: req.user,
      title: req.body.title,
      content: req.body.content,
      timestamp: req.body.timestamp,
    });
    if (!errors.isEmpty()) {
      res.render("message-form");
    }
    message.save((err) => {
      if (err) {
        return next(err);
      }
    });

    console.log("USERRRR ISSS" + req.user);
  },
];
