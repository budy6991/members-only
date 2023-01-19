const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.index = (req, res, next) => {
  res.render("index", { title: "Members Only Application!" });
};
