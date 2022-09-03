const Event = require("../models/event");

const createEvent = async (req, res) => {
  const {
    eventType,
    eventTitle,
    eventDescription,
    eventDates,
    eventLocation,
    eventLink,
    dateRange,
    duration,
  } = req.body;

  if (
    !eventType ||
    !eventTitle ||
    !eventDescription ||
    !eventDates ||
    !eventLocation ||
    !eventLink ||
    !dateRange ||
    !duration
  ) {
    return res.status(400).json({
      success: false,
      msg: "Please fill all the fields!",
    });
  }

  try {
    const event = await Event.create({
      eventType,
      eventTitle,
      eventDescription,
      eventDates,
      eventLocation,
      eventLink,
      dateRange,
      duration,
    });
    res
      .status(201)
      .json({ success: true, event, msg: "Event created successfully!!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const updateEvent = async (req, res) => {
  const {
    eventType,
    eventTitle,
    eventDescription,
    eventDates,
    eventLocation,
    eventLink,
    dateRange,
    duration,
  } = req.body;

  if (
    !eventType ||
    !eventTitle ||
    !eventDescription ||
    !eventDates ||
    !eventLocation ||
    !eventLink ||
    !dateRange ||
    !duration
  ) {
    return res
      .status(500)
      .json({ success: false, msg: "Please fill all the fields!" });
  }

  try {
    const event = await Event.updeOne(req.params.id, {
      $set: {
        eventType,
        eventTitle,
        eventDescription,
        eventDates,
        eventLocation,
        eventLink,
        dateRange,
        duration,
      },
    });
    res
      .status(201)
      .json({ success: true, event, msg: "Event updated successfully!!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(500).json({ success: false, msg: "No event id found!" });
  }
  try {
    const event = await Event.deleteOne(req.body.id);
    res
      .status(201)
      .json({ success: true, event, msg: "Event deleted successfully!!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal server error!" });
  }
};

const getEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(500).json({ success: false, msg: "No event id found!" });
  }

  try {
    const event = await Event.findOne({ _id: id });
    res
      .status(201)
      .json({ success: true, event, msg: "Event fetched successfully!!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal server error!" });
  }
};

module.exports = { createEvent, updateEvent, deleteEvent, getEvent };
