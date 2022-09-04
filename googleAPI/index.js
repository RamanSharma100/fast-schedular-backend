const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const Event = require("../models/event");
const express = require("express");
const router = express.Router();
const Alottments = require("../models/allotments");

router.post("/createEvent", async (req, res) => {
  const { name, email, description, date, time, eventId } = req.body;
  // get event

  const event = await Event.findOne({ _id: eventId }).populate("createdBy");
  const SCOPES = ["https://www.googleapis.com/auth/calendar"];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = path.join(process.cwd(), "googleAPI/token.json");
  const CREDENTIALS_PATH = path.join(
    process.cwd(),
    "googleAPI/credentials.json"
  );

  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async function loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  const authorize = async () => {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  };

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async function listEvents(auth) {
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log("No upcoming events found.");
      return;
    }
    console.log("Upcoming 10 events:");
    events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${start} - ${event.summary}`);
    });
  }

  const createEvent = async (
    auth,
    event,
    name,
    email,
    description,
    date,
    time
  ) => {
    // If modifying these scopes, delete token.json.
    var event = {
      summary: event.eventTitle,
      location: event.eventLocation,
      description: event.eventDescription,
      start: {
        dateTime: `2022-09-5T17:09:00-06:00`,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: "2022-09-5T17:00:00-07:00",
        timeZone: "Asia/Kolkata",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      attendees: [{ email: email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.insert(
      {
        auth: auth,
        calendarId: "primary",
        resource: event,
      },
      function (err, event) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        console.log("Event created: %s", event.data);
      }
    );
  };

  authorize()
    .then((auth) => {
      createEvent(auth, event, name, email, description, date, time);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
