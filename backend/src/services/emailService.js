const nodemailer = require("nodemailer");

// Universal SMTP configuration (Brevo, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Email service configuration error:", error);
    console.error("Please check SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables");
  } else {
    console.log("✅ Email service ready");
  }
});

/**
 * Send OTP email for email verification
 */
async function sendOtpEmail(email, otp, firstName) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "HireHub - Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">HireHub Email Verification</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Hello ${firstName},</p>
          <p>Thank you for registering with HireHub! Please use the following OTP to verify your email address:</p>
          <div style="background-color: #007bff; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 30 minutes.</strong></p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div style="text-align: center; color: #666; font-size: 12px;">
          <p>© 2025 HireHub. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to:", email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(email, resetToken, firstName) {
  const resetUrl = `${process.env.BACKEND_URL || "http://localhost:4000"}/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "HireHub - Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">HireHub Password Reset</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Hello ${firstName},</p>
          <p>You requested a password reset for your HireHub account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Or copy this link manually: <a href="${resetUrl}">${resetUrl}</a></p>
        </div>
        <div style="text-align: center; color: #666; font-size: 12px;">
          <p>© 2025 HireHub. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent to:", email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send contact email to freelancer
 */
async function sendContactEmail(freelancerEmail, freelancerName, senderName, senderEmail, message) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: freelancerEmail,
    subject: "HireHub - New Contact Request for Hire",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">New Hire Inquiry</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Hello ${freelancerName},</p>
          <p>You have received a new contact request from a potential client on HireHub!</p>
          
          <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <p><strong>From:</strong> ${senderName}</p>
            <p><strong>Email:</strong> ${senderEmail}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>Please reply directly to <strong>${senderEmail}</strong> to discuss this opportunity.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${senderEmail}" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reply to ${senderName}</a>
          </div>
        </div>
        <div style="text-align: center; color: #666; font-size: 12px;">
          <p>© 2025 HireHub. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Contact email sent to:", freelancerEmail);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Failed to send contact email:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendContactEmail,
};
