require("dotenv").config();
const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult, check } = require("express-validator");
const flash = require("express-flash-messages");
const bcrypt = require("bcryptjs");
const async = require("async");
const passport = require("passport");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_CR,
  },
});
const UserOTPVerification = require("../models/userOTPVerification");

const sendOTPVerificationEmail = async (_id, email) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    // mail options
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: "Verify Your Email",
      html: `<h2>Welcome to Members Only Application</h2> <p>Here is your verification code: <b>${otp}</b></p> <p>The code will be available for <b>1 hour.</b></p>`,
    };

    // hash the otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOTPVerification.save();
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Success");
      }
    });
    (req, res, next) => {
      res.json({
        status: "PENDING",
        message: "Verification otp email sent",
        data: {
          userId: _id,
          email,
        },
      });
    };
  } catch (err) {
    (req, res, next) => {
      res.json({
        status: "FAILED",
        message: error.message,
      });
    };
  }
};

exports.index = (req, res, next) => {
  Message.find()
    .populate("author")
    .exec(function (err, messages_list) {
      if (err) {
        return next(err);
      }
      res.render("index", { user: req.user, list_messages: messages_list });
    });
};

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
  body("email", "Email is required").trim().isLength({ min: 1 }).escape(),
  body("password", "Password is required").trim().isLength({ min: 5 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        membership: "user",
      });
      console.log(user);
      if (!errors.isEmpty()) {
        res.render("sign-up-form", {
          title: "Sign up to the app",
          errors: errors.array(),
        });
      }

      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  },
];

exports.membership_get = (req, res, next) => {
  sendOTPVerificationEmail(req.user._id, req.user.email);

  res.render("membership-form");
};

exports.verify_otp = async (req, res, next) => {
  console.log(req.user);
  try {
    let { otp } = req.body;
    let userId = req.user._id;
    if (!userId || !otp) {
      throw Error("Emtpy otp details are not allowed");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        throw new Error(
          "Account record doesnt exist of has been verified already. Please sign up or log in"
        );
      } else {
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;
        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ userId });
          throw new Error("Code has expired. Please request again");
        } else {
          //HashedOTP not working, probably not being reached.
          console.log("HERE" + " " + otp, hashedOTP);
          const validOTP = await bcrypt.compare(otp, hashedOTP);

          if (!validOTP) {
            throw new Error("Invalid code passed. Check your index");
          } else {
            await User.updateOne({ _id: userId }, { membership: "member" });
            UserOTPVerification.deleteMany({ userID });
            res.json({
              status: "VERIFIED",
              message: "User email verified successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

exports.log_in_get = (req, res, next) => {
  res.render("log-in");
};

exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
});

exports.log_out = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
