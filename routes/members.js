const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");

// User routes

router.get("/sign-up", user_controller.sign_up_get);

// router.post("/sign-up", user_controller.sign_up_post);

module.exports = router;
