const axios = require("axios");

const axiosClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosClient;
