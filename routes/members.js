const express = require("express");
const User = require("../models/user");
const router = express.Router();
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Message routes

router.get("/create-message", message_controller.create_message_get);

router.post("/create-message", message_controller.create_message_post);

// User routes

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Incorrect username" });
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return done(err);
        if (res) return done(null, user);
        else return done(null, false, { message: "Incorrect Password" });
      });
    });
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id, (err, user) => done(err, user))
);

router.get("/", user_controller.index);

router.get("/sign-up", user_controller.sign_up_get);

router.post("/sign-up", user_controller.sign_up_post);

router.get("/log-in", user_controller.log_in_get);

router.post("/log-in", user_controller.log_in_post);

router.get("/log-out", user_controller.log_out);

router.get("/:id/delete", message_controller.delete_message_get);

router.post("/:id/delete", message_controller.delete_message_post);

router.get("/membership", user_controller.membership_get);

router.post("/membership", user_controller.verify_otp);

module.exports = router;
