const Event = require("../models/event");
const moment = require("moment");

const createEvent = async (req, res) => {
  const {
    eventType,
    eventTitle,
    eventDescription,
    eventDates,
    eventLocationType,
    eventLocationLink,
    dateRange,
    duration,
  } = req.body;

  if (
    !eventType ||
    !eventTitle ||
    !eventDates ||
    !eventLocationType ||
    !duration
  ) {
    return res.status(400).json({
      success: false,
      msg: "Please fill all the fields!",
    });
  }

  const slots = [...new Set(eventDates)].map((slot) => {
    let x = {
      slotInterval: Number(duration),
      openTime: "09:00",
      closeTime: "17:00",
    };
    let startTime = moment(x.openTime, "HH:mm");
    let endTime = moment(x.closeTime, "HH:mm");
    let allTimes = [];

    while (startTime < endTime) {
      allTimes.push({ date: slot, time: startTime.format("HH:mm") });
      startTime.add(x.slotInterval, "minutes");
    }
    return allTimes;
  });

  try {
    const event = await Event.create({
      eventType,
      eventTitle,
      eventDescription,
      eventDates,
      eventLocationType,
      eventLocationLink,
      dateRange,
      emptySlots: slots,
      duration,
    });
    res
      .status(201)
      .json({ success: true, event, msg: "Event created successfully!!" });
    return;
  } catch (err) {
    console.log(err);
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
    console.log(err);
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

const getEvents = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(500).json({ success: false, msg: "No user id found!" });
  }

  try {
    const events = await Event.find({ createdBy: userId });
    return res
      .status(201)
      .json({ success: true, events, msg: "Events fetched successfully!!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal server error!" });
  }
};

module.exports = { createEvent, updateEvent, deleteEvent, getEvent, getEvents };
