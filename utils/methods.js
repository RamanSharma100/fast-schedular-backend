const geoip = require("geoip-lite");

module.exports = {
  getLocation: (request) => {
    // get user country using ip address
    const ip =
      request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    try {
      const { country } = geo;

      return country;
    } catch (err) {
      return null;
    }
  },
};
