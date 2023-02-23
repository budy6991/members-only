const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.create_message_get = (req, res, next) => {
  console.log(`User is ${req.user}`);
  res.render("message-form");
};

exports.create_message_post = [
  body("title", "Please write a title").trim().isLength({ min: 1 }).escape(),
  body("content", "Please write the message content")
    .isLength({ min: 20 })
    .escape(),
  (req, res, next) => {
    console.log("User is" + req.user);
    const errors = validationResult(req);
    User.findById(req.user._id).exec((err, user) => {
      if (err) return next(err);
      let message = new Message({
        author: user._id,
        title: req.body.title,
        content: req.body.content,
        timestamp: new Date(),
      });

      if (!errors.isEmpty()) {
        res.render("message-form");
      }
      message.save((err) => {
        if (err) {
          return next(err);
        }
      });
      res.redirect("/");
    });
  },
];

exports.delete_message_get = (req, res, next) => {
  Message.findById(req.params.id)
    .populate("author")
    .exec((err, message) => {
      if (err) {
        return next(err);
      }
      res.render("message_delete", {
        message: message,
      });
    });
};

exports.delete_message_post = (req, res, next) => {
  console.log(req.body.messageId);
};
