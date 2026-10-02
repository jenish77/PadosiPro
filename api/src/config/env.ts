import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5433/padosipro?schema=public',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'padosipro_access_secret_key_2026_production_ready',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'padosipro_refresh_secret_key_2026_production_ready',
  JWT_ACCESS_TIME: process.env.JWT_ACCESS_TIME || '15m',
  JWT_REFRESH_TIME: process.env.JWT_REFRESH_TIME || '7d',
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '1025', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'PadosiPro Support <no-reply@padosipro.com>',
};
