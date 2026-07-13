const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const sendEmail = async ({ to, subject, text, html, attachments }) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  if (!from || !to) throw new Error('Missing sender or recipient')

  await transporter.sendMail({ from, to, subject, text, html, attachments })
}

module.exports = { sendEmail }
