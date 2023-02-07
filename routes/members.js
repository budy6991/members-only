const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

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

module.exports = router;
