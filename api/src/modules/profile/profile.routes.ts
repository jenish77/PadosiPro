import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticateToken, requireVerifiedUser } from '../../middlewares/auth.middleware';
import { profileSchema } from '../../utils/validators';

const router = Router();

router.use(authenticateToken, requireVerifiedUser);

router.post('/', validateRequest(profileSchema), ProfileController.saveProfile);
router.get('/', ProfileController.getProfile);

export default router;
