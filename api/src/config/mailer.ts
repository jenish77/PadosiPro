import nodemailer from 'nodemailer';
import { env } from './env';

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for 587
  auth: env.SMTP_USER && env.SMTP_PASS
    ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      }
    : undefined,
  tls: {
    rejectUnauthorized: false,
  },
  debug: true, // Enable verbose debug logging for SMTP connections
  logger: true,
});
