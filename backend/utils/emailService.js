const nodemailer = require('nodemailer');

// Create transporter - Using Gmail SMTP (you can configure for other providers)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email template for invitation
const getInvitationTemplate = (name, invitationLink, inviterName) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 14px 28px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to TurHR</h1>
      <p>HR Management System</p>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>You've been invited by <strong>${inviterName}</strong> to join TurHR, our HR Management System.</p>
      <p>TurHR helps manage employees, payroll, attendance, projects, and team communication all in one place.</p>
      <p style="text-align: center;">
        <a href="${invitationLink}" class="button">Accept Invitation & Set Password</a>
      </p>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #8b5cf6;">${invitationLink}</p>
      <p><strong>This invitation will expire in 7 days.</strong></p>
      <p>If you didn't expect this invitation, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} TurHR. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;
};

exports.sendInvitationEmail = async (email, name, invitationLink, inviterName) => {
  try {
    // If no email credentials, just log (for development)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured. Invitation link:', invitationLink);
      return { success: true, message: 'Email service not configured. Check console for invitation link.' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"TurHR" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'You\'ve been invited to join TurHR',
      html: getInvitationTemplate(name, invitationLink, inviterName)
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Invitation email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message };
  }
};
