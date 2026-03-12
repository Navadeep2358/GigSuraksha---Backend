const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/send-email-otp", authController.sendEmailOTP);

router.post("/verify-email-otp", authController.verifyEmailOTP);

router.post("/login", authController.loginUser);

module.exports = router;