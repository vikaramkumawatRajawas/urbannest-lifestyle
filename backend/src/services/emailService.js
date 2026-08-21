import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

export const emailService = {
  // Send Password Reset Email
  sendPasswordResetEmail: async (toEmail, userName, resetToken) => {
    const frontendUrl = ENV.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const transporter = createTransporter();
    if (!transporter) {
      console.warn(
        `[EmailService Warning] SMTP credentials (SMTP_HOST/SMTP_USER) not configured. Password reset link for ${toEmail}: ${resetUrl}`
      );
      return { sent: false, reason: "SMTP_UNCONFIGURED", resetUrl };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"UrbanNest Store" <noreply@urbannest.com>',
      to: toEmail,
      subject: "Reset your UrbanNest password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #151918; color: #F4EFE6; padding: 30px; border-radius: 16px; border: 1px solid #D6B77A;">
          <h2 style="color: #D6B77A; font-family: Georgia, serif; text-transform: uppercase;">UrbanNest Lifestyle Store</h2>
          <p>Hello ${userName || "Valued Customer"},</p>
          <p>We received a request to reset your UrbanNest account password.</p>
          <p>Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #D6B77A; color: #0B0D0E; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 30px; display: inline-block; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #9E988F;">This link expires in 30 minutes. If you did not request this reset, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #222926; margin: 20px 0;" />
          <p style="font-size: 11px; color: #9E988F; text-align: center;">Regards,<br/><strong>UrbanNest Team</strong></p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return { sent: true };
    } catch (error) {
      console.error("[EmailService Error] Failed to send email:", error.message);
      return { sent: false, reason: error.message };
    }
  },

  // Send Account Recovery Email
  sendAccountRecoveryEmail: async (toEmail, userName, provider = "local") => {
    const transporter = createTransporter();
    
    let content = "";
    if (provider === "google") {
      content = `
        <p>You created your UrbanNest account using <strong>Google Sign-In</strong>.</p>
        <p>Please click "Continue with Google" on the login page to access your account.</p>
      `;
    } else if (provider === "facebook") {
      content = `
        <p>You created your UrbanNest account using <strong>Facebook Login</strong>.</p>
        <p>Please click "Continue with Facebook" on the login page to access your account.</p>
      `;
    } else {
      const maskedEmail = toEmail.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "*".repeat(b.length) + c);
      content = `
        <p>Your registered UrbanNest login email address is:</p>
        <h3 style="color: #7FFFD4; background: #0B0D0E; padding: 12px; border-radius: 8px; text-align: center;">${maskedEmail}</h3>
        <p>You can use this email address to log in to your account.</p>
      `;
    }

    if (!transporter) {
      console.warn(`[EmailService Warning] SMTP not configured. Account recovery query for ${toEmail} (provider: ${provider}).`);
      return { sent: false, reason: "SMTP_UNCONFIGURED" };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"UrbanNest Store" <noreply@urbannest.com>',
      to: toEmail,
      subject: "UrbanNest Account Recovery",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #151918; color: #F4EFE6; padding: 30px; border-radius: 16px; border: 1px solid #D6B77A;">
          <h2 style="color: #D6B77A; font-family: Georgia, serif; text-transform: uppercase;">UrbanNest Account Recovery</h2>
          <p>Hello ${userName || "Valued Customer"},</p>
          <p>You requested help recovering your UrbanNest account login details.</p>
          ${content}
          <p style="font-size: 12px; color: #9E988F; margin-top: 20px;">If you did not request this email, you can safely ignore it.</p>
          <hr style="border: 0; border-top: 1px solid #222926; margin: 20px 0;" />
          <p style="font-size: 11px; color: #9E988F; text-align: center;">Regards,<br/><strong>UrbanNest Team</strong></p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return { sent: true };
    } catch (error) {
      console.error("[EmailService Error] Failed to send recovery email:", error.message);
      return { sent: false, reason: error.message };
    }
  }
};
