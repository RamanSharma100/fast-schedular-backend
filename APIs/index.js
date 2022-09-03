const express = require("express");
const router = express.Router();

const authAPI = require("./auth.api");
const emailAPI = require("./email.api");

// routes
router.use("/auth", authAPI);
router.use("/email", emailAPI);

module.exports = router;
