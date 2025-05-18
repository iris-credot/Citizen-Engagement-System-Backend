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
    
    if (typeof to !== 'string') {
      throw new Error(`Invalid recipient email: ${JSON.stringify(to)}`);
    }
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: to.trim().toLowerCase(), // normalize the email
      subject,
      html: body,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (emailErr) {
    console.warn('❌ Failed to send email:', emailErr.message);
  }
};

module.exports = sendEmail;
