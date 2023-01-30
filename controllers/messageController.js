const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.index = (req, res, next) => {
  console.log(req.user);
  res.render("index", { user: req.user });
};
