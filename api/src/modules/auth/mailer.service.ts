import nodemailer from 'nodemailer';
import { transporter } from '../../config/mailer';
import { env } from '../../config/env';

export const sendOtpEmail = async (toEmail: string, otpCode: string): Promise<boolean> => {
  console.log(`[Mailer] 📧 Attempting to send OTP email to: ${toEmail} via SMTP (${env.SMTP_HOST}:${env.SMTP_PORT})`);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #FAF8F3;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #2E6B56; margin: 0;">PadosiPro</h2>
        <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Your Lifestyle Partner</p>
      </div>
      <div style="background: #ffffff; padding: 24px; border-radius: 6px; text-align: center;">
        <h3 style="color: #1E293B; margin-top: 0;">Verify your email address</h3>
        <p style="color: #475569; font-size: 14px;">Use the following 6-digit verification code to complete your registration. This code is valid for 10 minutes.</p>
        <div style="background-color: #FAF8F3; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #2E6B56; padding: 16px; border-radius: 6px; margin: 20px 0; border: 1px dashed #2E6B56;">
          ${otpCode}
        </div>
        <p style="color: #94A3B8; font-size: 12px; margin-bottom: 0;">If you did not request this email, please ignore it.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      to: toEmail,
      subject: `${otpCode} is your PadosiPro verification code`,
      html: htmlContent,
    });

    console.log(`[Mailer] ✅ Email sent successfully! MessageId: ${info.messageId}`);

    // If using Ethereal Mail, print the browser preview URL!
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Mailer] 🔗 Ethereal Mail Preview Link: ${previewUrl}`);
    }

    return true;
  } catch (error: any) {
    console.error(`[Mailer] ❌ Failed to send OTP email via SMTP:`, error.message || error);
    if (error.stack) {
      console.error(`[Mailer] Error Stack:`, error.stack);
    }
    return false;
  }
};
