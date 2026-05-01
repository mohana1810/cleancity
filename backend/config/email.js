const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"CleanCity 🌱" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

// Email templates
const emailTemplates = {

  reportSubmitted: (citizenName, reportTitle) => ({
    subject: '✅ Your waste report was submitted — CleanCity',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px">
        <div style="background:linear-gradient(135deg,#0a5c3f,#1D9E75);padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
          <h1 style="color:#fff;margin:0;font-size:24px">🌱 CleanCity</h1>
        </div>
        <h2 style="color:#0f2419">Report Submitted Successfully!</h2>
        <p style="color:#444;line-height:1.6">Hi <strong>${citizenName}</strong>,</p>
        <p style="color:#444;line-height:1.6">Your waste report <strong>"${reportTitle}"</strong> has been submitted successfully.</p>
        <div style="background:#edfaf4;border-left:4px solid #1D9E75;padding:16px;border-radius:8px;margin:20px 0">
          <p style="margin:0;color:#0f2419">⭐ You earned <strong>+10 Green Points</strong> for this report!</p>
        </div>
        <p style="color:#444;line-height:1.6">Our team will review and assign a driver to collect the waste shortly.</p>
        <p style="color:#888;font-size:13px;margin-top:24px">Thank you for helping keep our city clean! 💚</p>
      </div>
    `
  }),

  reportAssigned: (citizenName, reportTitle, driverName) => ({
    subject: '🚛 A driver has been assigned to your report — CleanCity',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px">
        <div style="background:linear-gradient(135deg,#0a5c3f,#1D9E75);padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
          <h1 style="color:#fff;margin:0;font-size:24px">🌱 CleanCity</h1>
        </div>
        <h2 style="color:#0f2419">Driver Assigned!</h2>
        <p style="color:#444;line-height:1.6">Hi <strong>${citizenName}</strong>,</p>
        <p style="color:#444;line-height:1.6">Good news! A driver has been assigned to your report <strong>"${reportTitle}"</strong>.</p>
        <div style="background:#e6f1fb;border-left:4px solid #378ADD;padding:16px;border-radius:8px;margin:20px 0">
          <p style="margin:0;color:#0f2419">🚛 Driver: <strong>${driverName}</strong> is on the way!</p>
        </div>
        <p style="color:#444;line-height:1.6">The waste will be collected soon. We'll notify you once it's done.</p>
        <p style="color:#888;font-size:13px;margin-top:24px">Thank you for your patience! 💚</p>
      </div>
    `
  }),

  reportCollected: (citizenName, reportTitle) => ({
    subject: '✅ Your waste report has been collected — CleanCity',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px">
        <div style="background:linear-gradient(135deg,#0a5c3f,#1D9E75);padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
          <h1 style="color:#fff;margin:0;font-size:24px">🌱 CleanCity</h1>
        </div>
        <h2 style="color:#0f2419">Waste Collected!</h2>
        <p style="color:#444;line-height:1.6">Hi <strong>${citizenName}</strong>,</p>
        <p style="color:#444;line-height:1.6">The waste from your report <strong>"${reportTitle}"</strong> has been successfully collected!</p>
        <div style="background:#edfaf4;border-left:4px solid #1D9E75;padding:16px;border-radius:8px;margin:20px 0">
          <p style="margin:0;color:#0f2419">🎉 Your area is now cleaner. Thank you for making a difference!</p>
        </div>
        <p style="color:#888;font-size:13px;margin-top:24px">Keep reporting to earn more Green Points! 💚</p>
      </div>
    `
  }),

  driverAssigned: (driverName, reportTitle, location) => ({
    subject: '📋 New task assigned to you — CleanCity',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px">
        <div style="background:linear-gradient(135deg,#185FA5,#378ADD);padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
          <h1 style="color:#fff;margin:0;font-size:24px">🚛 CleanCity Driver</h1>
        </div>
        <h2 style="color:#0f2419">New Collection Task!</h2>
        <p style="color:#444;line-height:1.6">Hi <strong>${driverName}</strong>,</p>
        <p style="color:#444;line-height:1.6">You have been assigned a new waste collection task.</p>
        <div style="background:#e6f1fb;border-left:4px solid #378ADD;padding:16px;border-radius:8px;margin:20px 0">
          <p style="margin:4px 0;color:#0f2419">📋 Task: <strong>${reportTitle}</strong></p>
          <p style="margin:4px 0;color:#0f2419">📍 Location: <strong>${location}</strong></p>
        </div>
        <p style="color:#444;line-height:1.6">Please log in to CleanCity to view full details and mark as collected once done.</p>
        <p style="color:#888;font-size:13px;margin-top:24px">Thank you for your service! 💚</p>
      </div>
    `
  })
};

module.exports = { sendEmail, emailTemplates };