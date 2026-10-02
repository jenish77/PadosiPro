import { Router } from 'express';
import { TaskController } from './task.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticateToken, requireVerifiedUser } from '../../middlewares/auth.middleware';
import { selectTasksSchema } from '../../utils/validators';

const router = Router();

router.use(authenticateToken, requireVerifiedUser);

router.get('/categories', TaskController.getCategories);
router.post('/select', validateRequest(selectTasksSchema), TaskController.saveSelections);
router.get('/my-selection', TaskController.getMySelections);

export default router;
