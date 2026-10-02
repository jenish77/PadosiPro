import { Response, NextFunction } from 'express';
import { ProfileService } from './profile.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class ProfileController {
  static async saveProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const profile = await ProfileService.saveProfile(req.user.userId, req.body);
      return sendSuccess(res, 'Profile saved successfully', profile, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const profile = await ProfileService.getProfile(req.user.userId);
      return sendSuccess(res, 'Profile retrieved successfully', profile, 200);
    } catch (error) {
      next(error);
    }
  }
}
