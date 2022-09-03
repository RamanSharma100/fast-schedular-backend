const dotEnv = require("dotenv");
// configure environment variables
dotEnv.config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const connectDB = require("./config/dbConnect");

const APIs = require("./APIs");

const app = express();

// configure middlewares
app.use(helmet());

// connect database
connectDB();

// enable cors
app.use(cors());

// enable body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the fastScheduler offical server");
});
app.use("/api", APIs);

// run server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
