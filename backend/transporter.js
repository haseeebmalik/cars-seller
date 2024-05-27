const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465, // Use port 465 for secure SMTP
  secure: true, // Use true for 465, false for other ports
  auth: {
    user: "muhammad.haseeb@devprovider.com",
    pass: "MHaseeb1238y65",
  },
});

module.exports = transporter;
