import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.register(email, password);
      return sendSuccess(res, result.message, result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return sendSuccess(res, result.message || 'Login successful', result, 200);
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code } = req.body;
      const result = await AuthService.verifyOtp(email, code);
      return sendSuccess(res, 'Email verified successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }

  static async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await AuthService.resendOtp(email);
      return sendSuccess(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const userStatus = await AuthService.getUserStatus(req.user.userId);
      return sendSuccess(res, 'User status retrieved successfully', userStatus, 200);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshSession(refreshToken);
      return sendSuccess(res, 'Token refreshed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }
}

