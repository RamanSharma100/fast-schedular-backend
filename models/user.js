const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    welcomeMessage: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      default:
        "Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.",
    },
    country: {
      type: String,
      default: "India",
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    loginType: {
      type: String,
      default: "email",
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    avalaibility: {
      type: Object,
      default: {
        sunday: "off",
        monday: "09:00-17:00",
        tuesday: "09:00-17:00",
        wednesday: "09:00-17:00",
        thursday: "09:00-17:00",
        friday: "09:00-17:00",
        saturday: "off",
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
