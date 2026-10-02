import { prisma } from '../../config/db';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/crypto';
import { OtpService } from './otp.service';

export class AuthService {
  static async register(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      if (!existingUser.isVerified) {
        const otpResult = await OtpService.createAndSendOtp(existingUser.id, normalizedEmail);
        return {
          userId: existingUser.id,
          email: normalizedEmail,
          isVerified: false,
          message: 'Account already registered but email not verified. Verification code sent.',
          cooldownSeconds: otpResult.cooldownSeconds,
        };
      }
      throw {
        statusCode: 409,
        message: 'This email is already linked to an account. Please sign in or use a different email address.',
      };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        isVerified: false,
        hasCompletedProfile: false,
      },
    });

    const otpResult = await OtpService.createAndSendOtp(user.id, normalizedEmail);

    return {
      userId: user.id,
      email: normalizedEmail,
      isVerified: false,
      message: 'Account created successfully. Please check your email for the verification code.',
      cooldownSeconds: otpResult.cooldownSeconds,
    };
  }

  static async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    if (!user.isVerified) {
      const otpResult = await OtpService.createAndSendOtp(user.id, normalizedEmail);
      return {
        isVerified: false,
        userId: user.id,
        email: normalizedEmail,
        message: 'Your email is not verified yet. A verification code has been sent to your inbox.',
        cooldownSeconds: otpResult.cooldownSeconds,
      };
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      isVerified: user.isVerified,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      isVerified: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        hasCompletedProfile: user.hasCompletedProfile,
        profile: user.profile,
      },
    };
  }

  static async verifyOtp(email: string, code: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User account not found' };
    }

    const verifyResult = await OtpService.verifyOtp(user.id, code);

    if (!verifyResult.success) {
      throw {
        statusCode: 400,
        message: verifyResult.message,
        codeExpired: verifyResult.codeExpired,
        maxAttemptsExceeded: verifyResult.maxAttemptsExceeded,
      };
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      isVerified: true,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        hasCompletedProfile: user.hasCompletedProfile,
        profile: user.profile,
      },
    };
  }

  static async refreshSession(providedRefreshToken: string) {
    if (!providedRefreshToken) {
      throw { statusCode: 400, message: 'Refresh token is required' };
    }

    try {
      const decoded = verifyRefreshToken(providedRefreshToken);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw { statusCode: 401, message: 'User no longer exists' };
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        isVerified: user.isVerified,
      };

      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw { statusCode: 401, message: 'Invalid or expired refresh token' };
    }
  }

  static async resendOtp(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User account not found' };
    }

    if (user.isVerified) {
      throw { statusCode: 400, message: 'This email is already verified' };
    }

    const otpResult = await OtpService.createAndSendOtp(user.id, normalizedEmail);

    if (!otpResult.success) {
      throw {
        statusCode: 429,
        message: otpResult.message,
        cooldownSeconds: otpResult.cooldownSeconds,
      };
    }

    return {
      message: 'A new verification code has been sent to your email',
      cooldownSeconds: 30,
    };
  }

  static async getUserStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        taskSelections: {
          include: {
            task: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    return {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      hasCompletedProfile: user.hasCompletedProfile,
      profile: user.profile,
      selectedTasksCount: user.taskSelections.length,
      selectedTasks: user.taskSelections.map((ts) => ts.task),
    };
  }
}
