require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const axios = require("axios");
const flash = require("express-flash-messages");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const User = require("./models/user");

// Set up database connection
const mongoose = require("mongoose");
const mongoDB = process.env.MONGO_DB_CONNECTION;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Import routes

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const membersRouter = require("./routes/members");

app.use("/", membersRouter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("cats"));

app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

// Set up passport

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

// Serialize/ Deserialize user

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id, (err, user) => done(err, user))
);

// Set up session and initialize passport

app.use(session({ secret: "dogs", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Access req.user globally

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
