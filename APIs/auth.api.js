const express = require("express");
const router = express.Router();

const {
  login,
  register,
  resetPassword,
} = require("../controllers/auth.controller");

// routes
router.post("/login", login);

router.post("/register", register);

router.post("/resetpassword", resetPassword);

module.exports = router;
