const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'muhammad.haseeb@devprovider.com',
//     pass: 'MHaseeb123!@#'
//   }
// });
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
