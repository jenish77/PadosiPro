import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateOtpCode = (): string => {
  const buffer = crypto.randomBytes(4);
  const number = buffer.readUInt32BE(0) % 1000000;
  return number.toString().padStart(6, '0');
};

export const hashOtp = (code: string): string => {
  return crypto.createHmac('sha256', env.JWT_ACCESS_SECRET).update(code).digest('hex');
};

export const verifyOtpHash = (code: string, hash: string): boolean => {
  const calculated = hashOtp(code);
  return crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(hash));
};

export interface TokenPayload {
  userId: string;
  email: string;
  isVerified: boolean;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_TIME as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_TIME as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};
