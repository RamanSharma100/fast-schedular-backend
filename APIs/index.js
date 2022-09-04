const express = require("express");
const router = express.Router();

const authAPI = require("./auth.api");
const emailAPI = require("./email.api");
const eventAPI = require("./event.api");
const alottAPI = require("../googleAPI");

// routes
router.use("/auth", authAPI);
router.use("/email", emailAPI);
router.use("/event", eventAPI);
router.use("/alott", alottAPI);

module.exports = router;
