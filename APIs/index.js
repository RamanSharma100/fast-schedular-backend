const express = require("express");
const router = express.Router();

const authAPI = require("./auth.api");
const emailAPI = require("./email.api");
const eventAPI = require("./event.api");

// routes
router.use("/auth", authAPI);
router.use("/email", emailAPI);
router.use("/event", eventAPI);

module.exports = router;
