// sendEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'sh10.nethosting.com',
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: 'quality@ci-aviation.com',
    pass: process.env.QSMTP_PASS,
  }
});

const mailOptions = {
  from: '"Quality" <quality@ci-aviation.com>',
  to: 'tim.kent@ci-aviation.com',
  subject: 'Hello from ESM!',
  text: 'This email was sent using ESM and nodemailer.',
};

try {
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
} catch (error) {
  console.error('Error sending email:', error);
}
