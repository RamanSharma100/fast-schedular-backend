const express = require("express");
const router = express.Router();

const {
  createEvent,
  deleteEvent,
  updateEvent,
  getEvent,
} = require("../controllers/eventCreation.controller");

const checkAuth = require("../middlewares/checkAuth");

module.exports = router;

// create new event
router.post("/create", checkAuth, createEvent);
router.post("/update", checkAuth, updateEvent);
router.post("/delete", checkAuth, deleteEvent);
router.get("/get", checkAuth, getEvent);

module.exports = router;
