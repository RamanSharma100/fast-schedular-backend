const express = require("express");
const router = express.Router();
const Allotment = require("../models/allotments");
const Event = require("../models/event");

// @route   add /allotment

const addAllotment = async (req, res) => {
  const { event, host, guest, date, time, duration, status } = req.body;

  if (!event || !host || !guest || !date || !time || !duration || !status) {
    return res.status(400).json({
      success: false,
      msg: "Please fill all the fields!",
    });
  }

  try {
    const allotment = await Allotment.create({
      event,
      host,
      guest,
      date,
      time,
      duration,
      status,
    });
    res.status(201).json({
      success: true,
      allotment,
      msg: "Allotment created successfully!!",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// @route   get /allotment

const getAllotments = async (req, res) => {
  const { userId } = req.body;

  try {
    const allotment = await Allotment.findOne({ host: userId })
      .populate("event")
      .populate("host");
    res.status(200).json({
      success: true,
      allotment,
      msg: "Allotments fetched successfully!!",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// cancel /allotment

const cancelAllotment = async (req, res) => {
  const { allotmentId, userId } = req.body;

  // check if the user is the host of the event

  const user = await User.findOne({ _id: allotmentId }).populate("host");

  if (user.host !== userId) {
    return res.status(400).json({
      success: false,
      msg: "You are not allowed to cancel the event!",
    });
  }

  try {
    const allotment = await Allotment.findOneAndUpdate(
      { _id: allotmentId },
      { status: "cancelled" }
    );
    res.status(200).json({
      success: true,
      allotment,
      msg: "Allotment cancelled successfully!!",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// @route   get /allotment/:id

const getSingleAllotment = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      msg: "Please provide a valid ID!",
    });
  }

  try {
    const allotment = await Allotment.findOne({ _id: id })
      .populate("event")
      .populate("host");
    res.status(200).json({
      success: true,
      allotment,
      msg: "Allotment fetched successfully!!",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

module.exports = {
  addAllotment,
  getAllotments,
  cancelAllotment,
  getSingleAllotment,
};
