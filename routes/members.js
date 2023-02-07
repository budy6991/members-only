const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const router = express.Router();
const bcrypt = require("bcryptjs");
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");
const User = require("../models/user");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect Password" });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  console.log("Serializing user...");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserialize user");
  console.log(`The id is ${id}`);
  try {
    const user = await User.findById(id);
    console.log(user);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

// Message routes

router.get("/create-message", message_controller.create_message_get);

router.post("/create-message", message_controller.create_message_post);

// User routes

router.get("/", user_controller.index);

router.get("/sign-up", user_controller.sign_up_get);

router.post("/sign-up", user_controller.sign_up_post);

router.get("/log-in", user_controller.log_in_get);

router.post("/log-in", user_controller.log_in_post);

router.get("/log-out", user_controller.log_out);

router.use((req, res, next) => {
  console.log("Inside Members Only Check Middleware");
  console.log(`User is ${req.user}`);
  if (req.user) next();
  else res.send(401, "User not found");
});

module.exports = router;
