import { Response, NextFunction } from 'express';
import { TaskService } from './task.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class TaskController {
  static async getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const categories = await TaskService.getCategoriesWithTasks();
      return sendSuccess(res, 'Task categories retrieved successfully', categories, 200);
    } catch (error) {
      next(error);
    }
  }

  static async saveSelections(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const { taskIds } = req.body;
      const selections = await TaskService.saveUserTaskSelections(req.user.userId, taskIds);
      return sendSuccess(res, 'Task selections saved successfully', selections, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getMySelections(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const selections = await TaskService.getUserTaskSelections(req.user.userId);
      return sendSuccess(res, 'Selected tasks retrieved successfully', selections, 200);
    } catch (error) {
      next(error);
    }
  }
}
