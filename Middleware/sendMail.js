// sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

const sendEmail = async (to, subject, body) => {
  try {
    await transporter.sendMail({
      from: `"Citizen Engagement System" <${process.env.AUTH_EMAIL}>`,
      to,
      subject,
      text: body,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
