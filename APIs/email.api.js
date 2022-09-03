const express = require("express");
const router = express.Router();

const {
  verifyEmail,
  sendResetPasswordLink,
} = require("../controllers/email.controller");

// routes
router.get("/verify/:token", verifyEmail);
router.post("/resetpassword", sendResetPasswordLink);

module.exports = router;
