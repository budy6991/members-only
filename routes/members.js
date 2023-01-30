const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

// Message routes

router.get("/", message_controller.index);

// User routes

router.get("/sign-up", user_controller.sign_up_get);

router.post("/sign-up", user_controller.sign_up_post);

router.post("/log-in", user_controller.log_in);

module.exports = router;
