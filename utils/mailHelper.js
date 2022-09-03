const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // define the email options
  const mailOptions = {
    from: "FastSchedular.live",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
