const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const allotmentSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    guest: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
        },
      ],
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "done", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Allotment = mongoose.model("Allotment", allotmentSchema);

module.exports = Allotment;
