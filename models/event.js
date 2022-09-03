const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Enum = ["one_to_one", "group"];

const eventSchema = new Schema(
  {
    eventType: {
      type: String,
      enum: Enum,
      required: true,
      default: "group",
    },
    eventTitle: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
    },
    eventDates: {
      type: [String],
      required: true,
    },
    filledSlots: {
      type: [{ type: Schema.Types.ObjectId, ref: "Allotment" }],
      default: [],
    },
    emptySlots: {
      type: [String],
      default: [],
    },
    eventLocationType: {
      type: String,
      enum: ["google_meet", "custom_link", "custom_location"],
      default: "custom_link",
      required: true,
    },
    eventLocation: {
      type: String,
      default: "",
    },
    eventLink: {
      type: String,
    },
    dateRange: {
      type: [String],
    },
    duration: {
      type: String,
      required: true,
      default: "15",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
